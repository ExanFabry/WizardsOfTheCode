import { Collection, MongoClient } from "mongodb";
import { Card, RootObject, User, UserDeck, UserCard } from "./types";

const uri = "mongodb+srv://duckaert:duckaert@webontwikkeling.canwgkr.mongodb.net/";
const client = new MongoClient(uri);

const cardCollection : Collection<Card> = client.db("mtgProject").collection<Card>("apiCardCollection");

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
        loadCardsFromApi()
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
            deck: []
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
        // Zoek de gebruiker
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            throw new Error(`User "${username}" not found.`);
        }

        // Maak het nieuwe deck aan
        const newDeck: UserDeck = {
            title: title,
            cards: []
        };

        // Voeg het nieuwe deck toe aan de decks van de gebruiker
        user.deck.push(newDeck);

        // Update de gebruikerscollectie met de bijgewerkte gegevens
        await userCollection.updateOne(
            { username: username },
            { $set: { deck: user.deck } }
        );

        console.log(`New deck "${title}" added for user "${username}".`);
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




/*
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
*/

export async function addCardToDeck(username: string, title: string, newCard: UserCard) {
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

        // Add the new card to the found deck
        user.deck[deckIndex].cards.push(newCard);

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

        // Remove the card from the deck
        deck.cards.splice(cardIndex, 1);

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

export async function readCardsFromDeck(username: string, title: string): Promise<{ title: string, multiverseid: number }[] | null> {
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

        // Map the cards to contain only title and multiverseid
        const cardsWithInfo = deck.cards.map(card => ({ title: card.name, multiverseid: card.multiverseid }));
        
        // Return the cards with title and multiverseid
        return cardsWithInfo;
    } catch (e) {
        console.error(e);
        return null;
    }
}


/*
let cards: UserCard[] = [
    { name: "Ancestor's Chosen", multiverseid: 1151616 },
    { name: "Beacon of Immortality", multiverseid: 148904 },
    { name: "Blessed Spirits", multiverseid: 148804 },
    { name: "Conclave Tribunal", multiverseid: 130542 },
    { name: "Detention Sphere", multiverseid: 130575 },
    { name: "Dovin's Veto", multiverseid: 148804 },
    { name: "Elite Inquisitor", multiverseid: 130560 },
    { name: "Favorable Winds", multiverseid: 149804 },
    { name: "Geist of Saint Traft", multiverseid: 148805 },
    { name: "Hallowed Fountain", multiverseid: 168804 },
    { name: "Lavinia, Azorius Renegade", multiverseid: 159804 },
    { name: "Lyev Skyknight", multiverseid: 148804 },
    { name: "Sphinx's Revelation", multiverseid: 130591 },
    { name: "Supreme Verdict", multiverseid: 130597 },
    { name: "Teferi, Time Raveler", multiverseid: 148804 }
];

let newCards: UserCard[] = [
    { name: "Archangel of Thune", multiverseid: 123456 },
    { name: "Cyclonic Rift", multiverseid: 234567 },
    { name: "Snapcaster Mage", multiverseid: 345678 },
    { name: "Thoughtseize", multiverseid: 456789 },
    { name: "Tarmogoyf", multiverseid: 567890 },
    { name: "Force of Will", multiverseid: 678901 },
    { name: "Sword of Fire and Ice", multiverseid: 789012 },
    { name: "Noble Hierarch", multiverseid: 890123 },
    { name: "Dark Confidant", multiverseid: 901234 },
    { name: "Jace, the Mind Sculptor", multiverseid: 101112 },
    { name: "Liliana of the Veil", multiverseid: 111213 },
    { name: "Mana Drain", multiverseid: 121314 },
    { name: "Verdant Catacombs", multiverseid: 131415 },
    { name: "Force of Negation", multiverseid: 141516 },
    { name: "Scalding Tarn", multiverseid: 151617 }
];



await addUser("dennis")
await addNewDeck("dennis", "azorius")
await addCardsToDeck("dennis", "azorius", cards)
await addCardsToDeck("dennis", "azorius", newCards)
await deleteCardFromDeck("dennis", "azorius", "Geist of Saint Traft")
await deleteCardFromDeck("dennis", "azorius", "Geist of Saint Traft")
await deleteCardFromDeck("dennis", "azorius", "Geist of Saint Traft")
*/