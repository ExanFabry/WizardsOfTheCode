import express from "express";
import { decksArr, azorius, azoriusMultiverseIds } from "../data";
import { Card, UserCard } from "../types";
import { addCardToDeck, changeDeckName, deleteCardFromDeck, getCards, readCardsFromDeck } from "../database";

let cachedCards : Card[];

export function newDeckRouter() {
    
    const router = express.Router();
    router.get("/", async (req, res) => { 
        
        if (!cachedCards) {
        cachedCards = await getCards();
        }

        const deckName: string = req.query.deckName as string;
        const newDeck: boolean = req.query.newDeck === "true";
        
        let cardsDeck : UserCard[] = [];
 
        const result = await readCardsFromDeck("dennis", deckName);
        if (result !== null) {
            cardsDeck = result.map(cardInfo => ({
            name: cardInfo.title,
            multiverseid: cardInfo.multiverseid,
            numberOfCards: cardInfo.numberOfCards,
            type: cardInfo.type // Toevoegen van het kaarttype
        }));
}

        res.render("newDeck", {
            title: "New Deck",
            deckName : deckName,
            newDeck : newDeck,
            cards : cachedCards,
            deck : cardsDeck
        })
    });

    router.post("/", async (req, res) => {
        let nameToAdd : string = req.body.nameToAdd;
        let idToAdd : number = parseInt(req.body.idToAdd);
        let typeToAdd : string = req.body.typeToAdd;
        let nameToRemove : string = req.body.nameToRemove;
        let newDeckName : string = req.body.newDeckName;
        let deckName : string = typeof req.query.deckName == 'string' ? req.query.deckName : "";

        if (nameToAdd) {
            await addCardToDeck("dennis", deckName, nameToAdd, idToAdd, typeToAdd)
        }
    
        if (nameToRemove) {
            await deleteCardFromDeck("dennis", deckName, nameToRemove);
        }

        let redirectURL : string;

        if (newDeckName) {
            await changeDeckName("dennis", deckName, newDeckName)
            let encodedDeckName = encodeURIComponent(newDeckName);
            redirectURL = "/newDeck?deckName=" + encodedDeckName + "&newDeck=true";
        } else {
            redirectURL = "/newDeck" + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
        }
        
        res.redirect(redirectURL);
    });


    return router;
}

