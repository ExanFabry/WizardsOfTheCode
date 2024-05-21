import express from "express";
import { Card, UserCard} from "../types";
import { addCardToDeck, countCardsInDeck, getCards, getUserDecks, readCardsFromDeck } from "../database";
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

        let q = typeof req.query.q === 'string' ? req.query.q : "";
        let page = parseInt(typeof req.query.page === 'string' ? req.query.page : "1");
        let pageSize : number = 10;

        let filteredCards = cachedCards.filter(card => card.name.toLowerCase().includes(q.toLowerCase()));

        const totalItems : number = filteredCards.length;
        const totalPages : number = Math.ceil(totalItems / pageSize);
        const startIndex : number = (page - 1) * pageSize;
        const endIndex : number = Math.min(startIndex + pageSize - 1, totalItems - 1);
        const paginatedCards : Card[] = filteredCards.slice(startIndex, endIndex + 1);

        const message = req.session.message;
        delete req.session.message;

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
        let selectedDeck : string = req.body.selectedDeck;
        let namecard : string = req.body.namecard;
        let multiverseid : number = parseInt(req.body.multiverseid);
        let type : string = req.body.type;
        
        let cardsInDeck : number = await countCardsInDeck("dennis", selectedDeck, namecard)

        let cardsDeck : UserCard[] = [];

        if (selectedDeck !== undefined) {
            const result = await readCardsFromDeck("dennis", selectedDeck);
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


        if (numberOfCardsInDeck >= 60) {
            req.session.message = {type: "error", message: `Het deck "${selectedDeck}" zit vol.`};
        }
        else if (type !== "Land" && cardsInDeck >= 4) {
            req.session.message = {type: "error", message: `Het deck "${selectedDeck}" bevat al 4 kaarten van "${namecard}".`};
        }
        
        else {
            await addCardToDeck("dennis", selectedDeck, namecard, multiverseid, type)
            req.session.message = {type: "success", message: `"${namecard}" toegevoegd aan deck: "${selectedDeck}"`};
        }
        req.session.save(() => {
            res.redirect("back");
        });
    });
    
    return router;
}
