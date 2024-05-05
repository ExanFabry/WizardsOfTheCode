import { Collection, MongoClient } from "mongodb";
import { Card, RootObject, User, UserDeck, UserCard } from "./types";
import bcrypt from "bcrypt";

export const uri = "mongodb+srv://duckaert:duckaert@webontwikkeling.canwgkr.mongodb.net/";
//export const uri = "mongodb+srv://Exan:WizardsOfTheCode@decks.9htkbkt.mongodb.net/?retryWrites=true&w=majority&appName=Decks";
const client = new MongoClient(uri);

const cardCollection : Collection<Card> = client.db("mtgProject").collection<Card>("apiCardCollection");
//const cardCollection : Collection<Card> = client.db("WizardsOfTheCode").collection<Card>("apiCardCollection");
const saltRounds : number = 10;

export async function getCards() {
    return await cardCollection.find({}).toArray();
}

export async function loadCardsFromApi() {
    const cardsInDB: Card[] = await getCards();
    if (cardsInDB.length === 0) {
        console.log("Database is empty, loading cards from API");
        try {
            let currentPage = 1;

            // Fetch data until we receive an empty response
            while (true) {
                let response = await fetch(`https://api.magicthegathering.io/v1/cards?page=${currentPage}&pageSize=100`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
                }

                let data: RootObject = await response.json() as RootObject;

                // If no cards are returned, break the loop
                if (data.cards.length === 0) {
                    console.log("Database is full. No more cards to load.");
                    break;
                }

                // Add unique cards to the database
                for (const card of data.cards) {
                    const existingCard = await cardCollection.findOne({ name: card.name });
                    if (!existingCard) {
                        await cardCollection.insertOne({ name: card.name, multiverseid: card.multiverseid, type: card.type, rarity: card.rarity });
                    }
                }
                currentPage++;
            }
        } catch (e) {
            console.error(e);
        }
    }
}

export async function connect() {
    try {
        await client.connect();
        loadCardsFromApi();
        await createInitialUser();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error("An error occurred while connecting to the database:", error);
    }
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error("An error occurred while disconnecting from the database:", error);
    }
    process.exit(0);
}





const userCollection : Collection<User> = client.db("mtgProject").collection<User>("users");

export async function addUser(username: string) {
    try {
        // Check if the user already exists
        const existingUser = await userCollection.findOne({ username: username });
        if (existingUser) {
            throw new Error(`User "${username}" already exists.`);
        }

        // If the user does not exist, create a new user with an empty deck array
        const newUser: User = {
            username: username,
            deck: [],
            role: "USER"
        };

        // Insert the new user into the collection
        await userCollection.insertOne(newUser);

        console.log(`User "${username}" added.`);
    } catch (e) {
        console.error(e);
    }
}

export async function addNewDeck( username: string, title: string,) {
    try {
        // Find the user
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            throw new Error(`User "${username}" not found.`);
        }

        // Create the new deck
        const newDeck: UserDeck = {
            title: title,
            cards: []
        };

        // Add the new deck to the user's decks
        user.deck.push(newDeck);

        // Update the user's collection with the updated data
        await userCollection.updateOne(
            { username: username },
            { $set: { deck: user.deck } }
        );

        console.log(`New deck "${title}" added for user "${username}".`);
    } catch (e) {
        console.error(e);
    }
}

export async function deleteDeck(username: string, deckTitle: string) {
    try {
        // Find the user
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            throw new Error(`User "${username}" not found.`);
        }

        // Find the index of the deck to be deleted
        const deckIndex = user.deck.findIndex(deck => deck.title === deckTitle);
        if (deckIndex === -1) {
            throw new Error(`Deck "${deckTitle}" not found for user "${username}".`);
        }

        // Remove the deck from the user's decks
        user.deck.splice(deckIndex, 1);

        // Update the user's collection with the updated data
        await userCollection.updateOne(
            { username: username },
            { $set: { deck: user.deck } }
        );

        console.log(`Deck "${deckTitle}" deleted for user "${username}".`);
    } catch (e) {
        console.error(e);
    }
}

export async function getUserDecks(username: string) {
    try {
        // Find the user
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            throw new Error(`User "${username}" not found.`);
        }

        // Extract the titles from user's decks
        const deckTitles = user.deck.map(deck => deck.title);

        // Log whether decks are found or not
        if (deckTitles.length > 0) {
            console.log(`Decks found for user "${username}".`);
        } else {
            console.log(`No decks found for user "${username}".`);
        }

        // Return the user's deck titles
        return deckTitles;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function changeDeckName(username: string, currentTitle: string, newTitle: string) {
    try {
        // Find the user and the deck
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            throw new Error(`User "${username}" not found.`);
        }

        const deckIndex = user.deck.findIndex(deck => deck.title === currentTitle);
        if (deckIndex === -1) {
            throw new Error(`Deck "${currentTitle}" not found for user "${username}".`);
        }

        // Update the deck's name
        user.deck[deckIndex].title = newTitle;

        // Update only the deck's name in the database
        await userCollection.updateOne(
            { username: username, "deck.title": currentTitle },
            { $set: { "deck.$.title": newTitle } }
        );

        console.log(`Deck name changed from "${currentTitle}" to "${newTitle}" for user "${username}".`);
    } catch (e) {
        console.error(e);
    }
}


export async function addCardToDeck(username: string, title: string, name: string, multiverseid: number) {
    try {
        // Find the user
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            throw new Error(`User "${username}" not found.`);
        }

        // Find the deck with the specified title
        const deckIndex = user.deck.findIndex(deck => deck.title === title);
        if (deckIndex === -1) {
            throw new Error(`Deck "${title}" not found for user "${username}".`);
        }

        // Check if the card already exists in the deck
        const existingCardIndex = user.deck[deckIndex].cards.findIndex(card => card.name === name);
        if (existingCardIndex !== -1) {
            // If the card already exists, increment the numberOfCards
            user.deck[deckIndex].cards[existingCardIndex].numberOfCards++;
        } else {
            // If the card does not exist, create a new card object
            const newCard: UserCard = {
                name: name,
                multiverseid: multiverseid,
                numberOfCards: 1
            };
            // Add the new card to the deck
            user.deck[deckIndex].cards.push(newCard);
        }

        // Update the user collection with the updated data
        await userCollection.updateOne(
            { username: username },
            { $set: { deck: user.deck } }
        );

        console.log(`Card added to deck "${title}" for user "${username}".`);
    } catch (e) {
        console.error(e);
    } 
}

export async function deleteCardFromDeck(username: string, title: string, cardName: string) {
    try {
        // Find the user
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            throw new Error(`User "${username}" not found.`);
        }

        // Find the deck with the specified title
        const deck = user.deck.find(deck => deck.title === title);
        if (!deck) {
            throw new Error(`Deck "${title}" not found for user "${username}".`);
        }

        // Find the card index in the deck
        const cardIndex = deck.cards.findIndex(card => card.name === cardName);
        if (cardIndex === -1) {
            throw new Error(`Card "${cardName}" not found in deck "${title}" for user "${username}".`);
        }

        // Decrement the numberOfCards if it's greater than 1
        if (deck.cards[cardIndex].numberOfCards > 1) {
            deck.cards[cardIndex].numberOfCards--;
        } else {
            // If numberOfCards is 1, remove the card from the deck
            deck.cards.splice(cardIndex, 1);
        }

        // Update the user collection with the updated data
        await userCollection.updateOne(
            { username: username },
            { $set: { deck: user.deck } }
        );

        console.log(`Card "${cardName}" deleted from deck "${title}" for user "${username}".`);
    } catch (e) {
        console.error(e);
    }
}

export async function readCardsFromDeck(username: string, title: string) {
    try {
        // Find the user
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            throw new Error(`User "${username}" not found.`);
        }

        // Find the deck with the specified title
        const deck = user.deck.find(deck => deck.title === title);
        if (!deck) {
            throw new Error(`Deck "${title}" not found for user "${username}".`);
        }

        // Map the cards to include title, multiverseid, and numberOfCards
        const cardsWithInfo = deck.cards.map(card => ({
            title: card.name,
            multiverseid: card.multiverseid,
            numberOfCards: card.numberOfCards
        }));

        // Sort the cards by title
        const sortedCards = cardsWithInfo.sort((a, b) => a.title.localeCompare(b.title));

        // Return the sorted cards with title, multiverseid, and numberOfCards
        return sortedCards;
    } catch (e) {
        console.error(e);
        return null;
    }
}

//Create admin login
async function createInitialUser() {
    if (await userCollection.countDocuments() > 1) {
        return;
    }
    let email : string | undefined = process.env.ADMIN_EMAIL;
    let password : string | undefined = process.env.ADMIN_PASSWORD;
    console.log((email!));
    console.log((password!));
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await userCollection.insertOne({
        username: email,
        deck: [],
        password: await bcrypt.hash(password, saltRounds),
        role: "ADMIN"
    });
}

//Login function
export async function login(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await userCollection.findOne<User>({username: username});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}

/*
let cards: UserCard[] = [
    { name: "Ancestor's Chosen", multiverseid: 1151616, numberOfCards: 4 },
    { name: "Beacon of Immortality", multiverseid: 148904, numberOfCards: 4 },
    { name: "Blessed Spirits", multiverseid: 148804, numberOfCards: 4 },
    { name: "Conclave Tribunal", multiverseid: 130542, numberOfCards: 4 },
    { name: "Detention Sphere", multiverseid: 130575, numberOfCards: 4 },
    { name: "Dovin's Veto", multiverseid: 148804, numberOfCards: 4 },
    { name: "Elite Inquisitor", multiverseid: 130560, numberOfCards: 4 },
    { name: "Favorable Winds", multiverseid: 149804, numberOfCards: 4 },
    { name: "Geist of Saint Traft", multiverseid: 148805, numberOfCards: 4 },
    { name: "Hallowed Fountain", multiverseid: 168804, numberOfCards: 4 },
    { name: "Lavinia, Azorius Renegade", multiverseid: 159804, numberOfCards: 4 },
    { name: "Lyev Skyknight", multiverseid: 148804, numberOfCards: 4 },
    { name: "Sphinx's Revelation", multiverseid: 130591, numberOfCards: 4 },
    { name: "Supreme Verdict", multiverseid: 130597, numberOfCards: 4 },
    { name: "Teferi, Time Raveler", multiverseid: 148804, numberOfCards: 4 }
];

let newCards: UserCard[] = [
    { name: "Archangel of Thune", multiverseid: 123456, numberOfCards: 4 },
    { name: "Cyclonic Rift", multiverseid: 234567, numberOfCards: 4 },
    { name: "Snapcaster Mage", multiverseid: 345678, numberOfCards: 4 },
    { name: "Thoughtseize", multiverseid: 456789, numberOfCards: 4 },
    { name: "Tarmogoyf", multiverseid: 567890, numberOfCards: 4 },
    { name: "Force of Will", multiverseid: 678901, numberOfCards: 4 },
    { name: "Sword of Fire and Ice", multiverseid: 789012, numberOfCards: 4 },
    { name: "Noble Hierarch", multiverseid: 890123, numberOfCards: 4 },
    { name: "Dark Confidant", multiverseid: 901234, numberOfCards: 4 },
    { name: "Jace, the Mind Sculptor", multiverseid: 101112, numberOfCards: 4 },
    { name: "Liliana of the Veil", multiverseid: 111213, numberOfCards: 4 },
    { name: "Mana Drain", multiverseid: 121314, numberOfCards: 4 },
    { name: "Verdant Catacombs", multiverseid: 131415, numberOfCards: 4 },
    { name: "Force of Negation", multiverseid: 141516, numberOfCards: 4 },
    { name: "Scalding Tarn", multiverseid: 151617, numberOfCards: 4 }
];

];



await addUser("dennis")
await addNewDeck("dennis", "azorius")
await addCardsToDeck("dennis", "azorius", cards)
await addCardsToDeck("dennis", "azorius", newCards)
await deleteCardFromDeck("dennis", "azorius", "Geist of Saint Traft")
await deleteCardFromDeck("dennis", "azorius", "Geist of Saint Traft")
await deleteCardFromDeck("dennis", "azorius", "Geist of Saint Traft")
*/

export async function addCardsToDeck(username: string, title: string, newCards: UserCard[]) {
    try {
        // Find the user
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            throw new Error(`User "${username}" not found.`);
        }

        // Find the deck with the specified title
        const deckIndex = user.deck.findIndex(deck => deck.title === title);
        if (deckIndex === -1) {
            throw new Error(`Deck "${title}" not found for user "${username}".`);
        }

        // Add new cards to the found deck
        user.deck[deckIndex].cards.push(...newCards);

        // Update the user collection with the updated data
        await userCollection.updateOne(
            { username: username },
            { $set: { deck: user.deck } }
        );

        console.log(`Cards added to deck "${title}" for user "${username}".`);
    } catch (e) {
        console.error(e);
    } 
}