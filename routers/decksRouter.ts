import express from "express";
import { cards, decksArr, azorius, azoriusMultiverseIds } from "../data";

export function decksRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {        
        res.render("decks", {
            title: "Decks",
            decksArr : decksArr,
            cards : cards
        })
    });

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
