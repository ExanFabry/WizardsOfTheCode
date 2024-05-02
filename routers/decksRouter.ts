import express from "express";
import { cards, decksArr, azorius, azoriusMultiverseIds } from "../data";
import { addNewDeck, changeDeckName, deleteDeck, getUserDecks } from "../database";

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

    router.post("/", async (req, res) => {
        let newDeck : boolean = false;
        let deckName = req.body.nameNew;
        let newDeckName = req.body.newDeckName;
        let oldDeckName = req.body.oldDeckName;
        let deckDelete = req.body.deckDelete;

        if (deckDelete) {
            await deleteDeck("dennis", deckDelete)
            res.redirect("/decks");
            return
        }
        
        if (newDeckName) {
            await changeDeckName("dennis", oldDeckName, newDeckName)
            res.redirect("/decks");
            return
        }

        if (deckName) {
            newDeck = true;
            await addNewDeck("dennis", deckName)
        } else {
            deckName = req.body.nameEdit;
        }

        res.redirect(`/newDeck?deckName=${encodeURIComponent(deckName)}&newDeck=${newDeck}`);
    
    });
    

    return router;
}
