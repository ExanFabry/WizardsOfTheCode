import express from "express";
import { decksArr, azorius, azoriusMultiverseIds } from "../data";
import { Card, UserCard } from "../types";
import { addCardToDeck, deleteCardFromDeck, getCards, readCardsFromDeck } from "../database";

export function newDeckRouter() {
    
    const router = express.Router();
    router.get("/", async (req, res) => { 
        
        let cards : Card[]= await getCards();

        const deckName: string = req.query.deckName as string;
        const newDeck: boolean = req.query.newDeck === "true";
        
        let cardsDeck : UserCard[] = [];
        const result = await readCardsFromDeck("dennis", deckName);
        if (result !== null) {
            cardsDeck = result.map(cardInfo => ({
                name: cardInfo.title,
                multiverseid: cardInfo.multiverseid
            }));
        }
        
        res.render("newDeck", {
            title: "New Deck",
            deckName : deckName,
            newDeck : newDeck,
            cards : cards,
            deck : cardsDeck
        })
    });

    router.post("/", async (req, res) => {
        let nameToAdd : string = req.body.nameToAdd;
        let idToAdd : number = parseInt(req.body.idToAdd)
        let nameToRemove : string = req.body.nameToRemove;
        let idToRemove : string = req.body.idToRemove

        function createUserCard(name: string, multiverseid: number): UserCard {
            return {
                name: name,
                multiverseid: multiverseid
            };
        }
        let cardToAdd: UserCard = createUserCard(nameToAdd, idToAdd);
        await addCardToDeck("dennis", "azorius", cardToAdd)

        await deleteCardFromDeck("dennis", "azorius", nameToRemove)
        
        res.redirect("/newDeck");
    });


    return router;
}

