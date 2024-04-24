import express from "express";
import { cards} from "../data";
import { Card } from "../types";



export function homeRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {
        let q = typeof req.query.q === 'string' ? req.query.q : "";
        let page = parseInt(typeof req.query.page === 'string' ? req.query.page : "1");
        let pageSize = 20;

        let filteredCards = cards.filter(card => card.name.toLowerCase().includes(q.toLowerCase()));

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
            totalPages: totalPages
        });
    });

    return router;
}