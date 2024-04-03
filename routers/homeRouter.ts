import express from "express";
import { cards } from "../data";
import { Card } from "../types";



export function homeRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        let q = typeof req.query.q === 'string' ? req.query.q : "";
 
    let filteredCards : Card[] = [...cards];
    filteredCards = filteredCards.filter(cards => cards.name.toLowerCase().includes(q.toLowerCase()))

        res.render("home", {
            title: "Home",
            cards : filteredCards,
            q : q
        })
    });

    return router;
}