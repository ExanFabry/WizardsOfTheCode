import express from "express";
import { cards, decksArr, azorius, azoriusMultiverseIds } from "../data";
import { getUserDecks } from "../database";

export function decksRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {      

        let userDecks: string[] = [] 
        const result =  await getUserDecks("dennis");
    
        if (result !== null) {
            userDecks = result
        }

        res.render("decks", {
            title: "Decks",
            decks : userDecks,
            cards : cards
        })
    })

    router.post("/", (req, res) => {
        let newDeck : boolean = false;
        let deckName = req.body.nameNew;
        if (deckName) {
            newDeck = true;
        } else {
            deckName = req.body.nameEdit;
        }

        res.redirect(`/newDeck?deckName=${encodeURIComponent(deckName)}&newDeck=${newDeck}`);
    
    });
    

    return router;
}
