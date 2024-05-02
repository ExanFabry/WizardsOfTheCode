import express from "express";
import { Card} from "../types";
import { addCardToDeck, getCards, getUserDecks } from "../database";

const app = express();

let cachedCards : Card[];

export function homeRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {
        if (!cachedCards) {
            cachedCards = await getCards();
        }

        let userDecks: string[] = [] 
        const result =  await getUserDecks("dennis");
    
        if (result !== null) {
            userDecks = result
        }

        let q = typeof req.query.q === 'string' ? req.query.q : "";
        let page = parseInt(typeof req.query.page === 'string' ? req.query.page : "1");
        let pageSize = 10;

        let filteredCards = cachedCards.filter(card => card.name.toLowerCase().includes(q.toLowerCase()));

        const totalItems = filteredCards.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        const paginatedCards = filteredCards.slice(startIndex, endIndex + 1);

        res.render("home", {
            title: "Home",
            cards: paginatedCards,
            q: q,
            page: page,
            totalPages: totalPages,
            userDecks : userDecks
        });
    });

    router.post("/", async (req, res) => {
        let selectedDeck = req.body.selectedDeck;
        let namecard = req.body.namecard;
        let multiverseid = req.body.multiverseid;
        
        await addCardToDeck("dennis", selectedDeck, namecard, multiverseid)

        res.redirect("/home");
    });
    
    return router;
}
