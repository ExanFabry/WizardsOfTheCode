import express from "express";
import { cards, decksArr, azorius, azoriusMultiverseIds } from "../data";
import { Card } from "../types";

export function newDeckRouter() {
    
    const router = express.Router();
    router.get("/", (req, res) => { 
        
        const deckName: string = req.query.deckName as string;
        const newDeck: boolean = req.query.newDeck === "true";
        
        res.render("newDeck", {
            title: "New Deck",
            deckName : deckName,
            newDeck : newDeck,
            cards : cards,
            deck1 : azorius,
            deck1Id : azoriusMultiverseIds
        })
    });

    router.post("/", (req, res) => {
        let nameToAdd : string = req.body.nameToAdd;
        let idToAdd : string = req.body.idToAdd
        let nameToRemove : string = req.body.nameToRemove;
        let idToRemove : string = req.body.idToRemove

        console.log(nameToAdd);
        console.log(idToAdd);
        console.log(nameToRemove);
        console.log(idToRemove)
        res.redirect("/newDeck");
    });


    return router;
}

