import express from "express";
import { cards } from "../data";

export function homeRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("home", {
            title: "Home",
            cards : cards
        })
    });

    return router;
}