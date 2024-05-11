import express from "express";
import { User, UserDeck, UserCard } from "../types";
import { addUser } from "../database";

// ---------------------------------
export function registerFormRouter() {
    const router = express.Router();
    const user : User | null = null;
    router.get("/", (req, res) => {
        res.render("registerForm", {
            title: "Registreer",
            user: user
        })
    });
    router.post("/createNewAccount", (req, res) => {
        const email : string = req.body.username;
        const password : string = req.body.password;
        /*let deckArrays : UserDeck[] = [];
        let cardArray : UserCard[] = [];
        let card : UserCard = {name: "Ancestor's Chosen", multiverseid: 130550, type: "Creature — Human Cleric", numberOfCards: 1}
        cardArray.push(card);
        const firstDeck : UserDeck = {title: "Eerste deck", cards: cardArray}
        deckArrays.push(firstDeck);
        let newUser : User = {username: email, deck: deckArrays, password: password, role: "USER"}*/

        addUser(email, password);
        res.render("registerForm", {
            title: "Gelukt",
            user: user
        })
    })
    return router;
}