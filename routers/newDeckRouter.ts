import express from "express";
import { Card, UserCard } from "../types";
import { addCardToDeck, changeDeckName, deleteCardFromDeck, getCards, getUserDecks, readCardsFromDeck } from "../database";
import session from "../session";
import { flashMiddleware } from "../flashMiddleware";

const app = express();
app.use(session);
app.use(flashMiddleware);

let cachedCards : Card[];

export function newDeckRouter() {
    
    const router = express.Router();
    router.get("/", async (req, res) => { 
        
        if (!cachedCards) {
        cachedCards = await getCards();
        }

        const deckName: string = req.query.deckName as string;
        const newDeck: boolean = req.query.newDeck === "true";

        const username : string = typeof req.session.user?.username === 'string' ? req.session.user?.username : "";
        
        let cardsDeck : UserCard[] = [];
 
        if (deckName !== undefined) {
            const result = await readCardsFromDeck(username, deckName);
            if (result !== null) {
                cardsDeck = result.map(cardInfo => ({
                name: cardInfo.title,
                multiverseid: cardInfo.multiverseid,
                numberOfCards: cardInfo.numberOfCards,
                type: cardInfo.type
            }));
        }
        }

        const numberOfCardsInDeck : number = cardsDeck.reduce((total, card) => total + card.numberOfCards, 0);

        // Create a Set of multiverseid from cardsDeck
        const deckIds = new Set(cardsDeck.map(card => card.multiverseid));

        // Filter out cachedCards that are in the deckIds Set
        const remainingCards : Card[] = cachedCards.filter(card => !deckIds.has(Number(card.multiverseid)));

        const message = req.session.message;
        delete req.session.message;

        res.render("newDeck", {
            title: "New Deck",
            deckName : deckName,
            newDeck : newDeck,
            cards: remainingCards,  // Send only the remaining cards
            deck : cardsDeck,
            numberOfCardsInDeck: numberOfCardsInDeck,
            message: message
        })
    });

    router.post("/", async (req, res) => {
        let nameToAdd : string = req.body.nameToAdd;
        let idToAdd : number = parseInt(req.body.idToAdd);
        let typeToAdd : string = req.body.typeToAdd;
        let nameToRemove : string = req.body.nameToRemove;
        let newDeckName : string = req.body.newDeckName;
        let deckName : string = typeof req.query.deckName == 'string' ? req.query.deckName : "";

        const username : string = typeof req.session.user?.username === 'string' ? req.session.user?.username : "";

        if (nameToAdd) {
            await addCardToDeck(username, deckName, nameToAdd, idToAdd, typeToAdd)
            req.session.message = {type: "success", message: `"${nameToAdd}" toegevoegd aan deck.`};
        }
    
        if (nameToRemove) {
            await deleteCardFromDeck(username, deckName, nameToRemove);
            req.session.message = {type: "success", message: `"${nameToRemove}" verwijderd uit deck.`};
        }

        let redirectURL : string;

        if (newDeckName) {
            const userDecks = await getUserDecks(username);
            if (userDecks && userDecks.includes(newDeckName)) {
                req.session.message = {type: "error", message: `De naam "${newDeckName}" is al in gebruik.`};
                redirectURL = "/newDeck" + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
                return req.session.save(() => {
                    res.redirect(redirectURL);
                });
            } else {
                await changeDeckName(username, deckName, newDeckName)
                let encodedDeckName = encodeURIComponent(newDeckName);
                redirectURL = "/newDeck?deckName=" + encodedDeckName + "&newDeck=true";
            }
        } else {
            redirectURL = "/newDeck" + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
        }
        
        req.session.save(() => {
            res.redirect(redirectURL);
        });
    });


    return router;
}

