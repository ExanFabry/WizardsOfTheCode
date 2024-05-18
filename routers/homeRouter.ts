import express from "express";
import { Card} from "../types";
import { addCardToDeck, countCardsInDeck, getCards, getUserDecks } from "../database";
import session from "../session";
import { flashMiddleware } from "../flashMiddleware";

const app = express();
app.use(session);
app.use(flashMiddleware);

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

        const message = req.session.message;
        delete req.session.message;

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
            userDecks : userDecks,
            user: req.session.user?.username,
            message: message
        });
    });

    router.post("/", async (req, res) => {
        let selectedDeck = req.body.selectedDeck;
        let namecard = req.body.namecard;
        let multiverseid = req.body.multiverseid;
        let type = req.body.type;
        
        let cardsInDeck = await countCardsInDeck("dennis", selectedDeck, namecard)

        if (type !== "Land" && cardsInDeck >= 4) {
            req.session.message = {type: "error", message: `Het limiet van 4 kaarten is bereikt in deck: ${selectedDeck}. De kaart is niet toegevoegd.`};
        }
        else {
            await addCardToDeck("dennis", selectedDeck, namecard, multiverseid, type)
            req.session.message = {type: "success", message: `Kaart toegevoegd aan deck: ${selectedDeck}`};
        }
        res.redirect("back");
    });
    
    return router;
}
