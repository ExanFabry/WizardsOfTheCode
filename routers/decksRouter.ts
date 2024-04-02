import express from "express";
import { cards } from "../data";

let decksArr : string[] = ["Azorius", "Orzhov", "Dimir", "Rakdos" ];

let azorius: string[] = [
    "Ancestor's Chosen",
    "Beacon of Immortality",
    "Blessed Spirits",
    "Conclave Tribunal",
    "Detention Sphere",
    "Dovin's Veto",
    "Elite Inquisitor",
    "Favorable Winds",
    "Geist of Saint Traft",
    "Hallowed Fountain",
    "Lavinia, Azorius Renegade",
    "Lyev Skyknight",
    "Sphinx's Revelation",
    "Supreme Verdict",
    "Teferi, Time Raveler"
];

let azoriusMultiverseIds: number[] = [
    158804, // Ancestor's Chosen
    148904, // Beacon of Immortality - Multiverse ID not found
    148804, // Blessed Spirits - Multiverse ID not found
    130542, // Conclave Tribunal
    130575, // Detention Sphere
    148804, // Dovin's Veto - Multiverse ID not found
    130560, // Elite Inquisitor
    149804, // Favorable Winds - Multiverse ID not found
    148805, // Geist of Saint Traft - Multiverse ID not found
    168804, // Hallowed Fountain - Multiverse ID not found
    159804, // Lavinia, Azorius Renegade - Multiverse ID not found
    148804, // Lyev Skyknight - Multiverse ID not found
    130591, // Sphinx's Revelation
    130597, // Supreme Verdict
    148804, // Teferi, Time Raveler - Multiverse ID not found
];


export function decksRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {        
        res.render("decks", {
            title: "Decks",
            decksArr : decksArr,
            cards : cards
        })
    });

    router.post("/", (req, res) => {
        let newDeck : boolean = false;
        let deckName = req.body.nameNew;
        if (deckName) {
            newDeck = true;
        } else {
            deckName = req.body.nameEdit;
        }
        res.render("newDeck", {
            title: "New Deck",
            deckName : deckName,
            newDeck : newDeck,
            cards : cards,
            deck1 : azorius,
            deck1Id : azoriusMultiverseIds
        })
    });

    return router;
}
