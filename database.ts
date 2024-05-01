import { Collection, MongoClient } from "mongodb";
import { Card, RootObject } from "./types";

const uri = "mongodb+srv://duckaert:duckaert@webontwikkeling.canwgkr.mongodb.net/";
const client = new MongoClient(uri);

const cardCollection : Collection<Card> = client.db("mtgProject").collection<Card>("apiCardCollection");

export async function getCards() {
    return await cardCollection.find({}).toArray();
}

export async function loadCardsFromApi() {
    const cardsInDB : Card[] = await getCards();
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
                        await cardCollection.insertOne(card);
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


/*
interface User {
    deck: UserDeck[];
}

interface UserDeck {
    _id?: ObjectId;
    title: string;
    cards: UserCard[];
}

interface UserCard {
    name: string;
    multiverseid: number;
}


async function addNewDeck(title : string, user: string) {
    const userDeckCollection : Collection<User> = client.db("MTGproject").collection<User>(user);

    try {
        await client.connect();

        const deck: UserDeck = {
            title: title,
            cards: []
        };

        // await collection.insertOne(deck);
        
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function addCardsToDeck(title: string, user: string, cards: UserCard[]) {
    const collection: Collection<UserDeck> = client.db("MTGproject").collection<UserDeck>(user);

    try {
        await client.connect();

        let newCards: UserCard[] = [
            { name: "New Card 1", multiverseid: 2001 },
            { name: "New Card 2", multiverseid: 2002 },
            { name: "New Card 3", multiverseid: 2003 }
        ];
        
        await collection.updateOne(
            { title: title },
            { $push: { cards: { $each: newCards} } }
        );

        console.log(`Cards added to deck "${title}" for user "${user}".`);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

*/