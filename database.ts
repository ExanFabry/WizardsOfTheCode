import { Collection, MongoClient } from "mongodb";
import { Card, RootObject, User, UserDeck, UserCard } from "./types";
import bcrypt from "bcrypt";

export const uri = "mongodb+srv://duckaert:duckaert@webontwikkeling.canwgkr.mongodb.net/?retryWrites=true&w=majority&appName=Webontwikkeling";
//export const uri = "mongodb+srv://Exan:WizardsOfTheCode@decks.9htkbkt.mongodb.net/?retryWrites=true&w=majority&appName=Decks";
const client = new MongoClient(uri);

export async function cards() { 
    let cursor = client.db("mtgProject").collection("apiCardCollection").find<Card>({});
    let result : Card[] = await cursor.limit(60).toArray();
    console.log(result);
    return result;
}

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

export async function addUser(username: string, password: string) {
    try {
        // Check if the user already exists
        const existingUser = await userCollection.findOne({ username: username });
        if (existingUser) {
            throw new Error(`User "${username}" already exists.`);
        }

        // If the user does not exist, create a new user with an empty deck array
        const newUser: User = {
            username: username,
            password: await bcrypt.hash(password, saltRounds),
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

export async function deleteUser(username: string, password: string){
    try {
        // Check if the user already exists
        const existingUser = await userCollection.findOne({ username: username });
        if (existingUser) {
            await client.db("mtgProject").collection<User>("users").deleteOne({ username: username});
        }
        else{            
            throw new Error(`User "${username}" exists.`);
        }

        console.log(`User "${username}" deleted.`);
    } catch (e) {
        console.error(e);
    }
}

export async function addNewDeck(username: string, title: string, urlBackground?: string) {
    try {
        // Find the user
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            throw new Error(`User "${username}" not found.`);
        }

        // Create the new deck with a default background link if none provided
        const defaultBackgrounds = [
            'assets/images/deck1.jpg',
            'assets/images/deck2.jpg',
            'assets/images/deck3.jpg',
            'assets/images/deck4.jpg'
        ];

        // Choose a random background link if urlBackground is not provided
        let backgroundNumber = Math.floor(Math.random() * defaultBackgrounds.length);
        const randomBackground = defaultBackgrounds[backgroundNumber];

        const newDeck: UserDeck = {
            title: title,
            cards: [],
            urlBackground: urlBackground || randomBackground // Use the provided urlBackground or a random one
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
            console.log(`User "${username}" not found.`);
            return null; 
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

export async function getUserDecksFullDeck(username: string) {
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
        return user.deck;
    } catch (e) {
        //Returns null
        console.error(e);
        return null;
    }
}
export async function getUserDecksWithUrls(username: string) {
    try {
        // Find the user
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            console.log(`User "${username}" not found.`);
            return null;
        }

        // Extract the titles and background URLs from user's decks
        const decksWithUrls = user.deck.map(deck => ({
            title: deck.title,
            urlBackground: deck.urlBackground
        }));

        // Log whether decks are found or not
        if (decksWithUrls.length > 0) {
            console.log(`Decks found for user "${username}".`);
        } else {
            console.log(`No decks found for user "${username}".`);
        }

        // Return the user's deck titles with URLs
        return decksWithUrls;
    } catch (e) {
        console.error(e);
        return null;
    }
}
export async function getUserDecksWithCards(username: string) {
    try {
        // Find the user
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            throw new Error(`User "${username}" not found.`);
        }

        // Extract the titles from user's decks
        const decks = user.deck;

        // Log whether decks are found or not
        if (decks.length > 0) {
            console.log(`Decks found for user "${username}".`);
        } else {
            console.log(`No decks found for user "${username}".`);
        }

        // Return the user's deck titles
        return user.deck;
    } catch (e) {
        //Returns null
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

export async function addCardToDeck(username: string, title: string, name: string, multiverseid: number, type: string) {
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
                type: type.includes('Land') ? 'Land' : type, // Check if type contains 'Land'
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

        // Map the cards to include title, multiverseid, numberOfCards, and type
        const cardsWithInfo = deck.cards.map(card => ({
            title: card.name,
            multiverseid: card.multiverseid,
            numberOfCards: card.numberOfCards,
            type: card.type // Toevoegen van het kaarttype
        }));

        // Sort the cards by title
        const sortedCards = cardsWithInfo.sort((a, b) => a.title.localeCompare(b.title));

        // Return the sorted cards with title, multiverseid, numberOfCards, and type
        return sortedCards;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function countCardsInDeck(username: string, deckTitle: string, cardName: string) {
    try {
        // Find the user
        const user = await userCollection.findOne<User>({ username: username });
        if (!user) {
            throw new Error(`User "${username}" not found.`);
        }

        // Find the deck with the specified title
        const deck = user.deck.find(deck => deck.title === deckTitle);
        if (!deck) {
            throw new Error(`Deck "${deckTitle}" not found for user "${username}".`);
        }

        // Find the card index in the deck
        const cardIndex = deck.cards.findIndex(card => card.name === cardName);
        
        // If the card is not found, return 0
        if (cardIndex === -1) {
            return 0;
        }

        // Return the numberOfCards for the found card
        return deck.cards[cardIndex].numberOfCards;
    } catch (e) {
        console.error(e);
        throw e; // Re-throw the error to be handled by the caller
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