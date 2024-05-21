import express from "express";
import { addNewDeck, changeDeckName, deleteDeck, getUserDecks } from "../database";
import session from "../session";
import { flashMiddleware } from "../flashMiddleware";

const app = express();
app.use(session);
app.use(flashMiddleware);

export function decksRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {      

        let userDecks: string[] = [] 
        const result =  await getUserDecks("dennis");

        if (result !== null) {
            userDecks = result
        }

        const message = req.session.message;
        delete req.session.message;

        res.render("decks", {
            title: "Decks",
            decks : userDecks,
            user: req.session.user?.username,
            message: message
        })
    })

    router.post("/", async (req, res) => {
        let newDeck : boolean = false;
        let deckName : string = req.body.nameNew;
        let newDeckName : string = req.body.newDeckName;
        let oldDeckName : string = req.body.oldDeckName;
        let deckDelete : string = req.body.deckDelete;

        if (deckDelete) {
            await deleteDeck("dennis", deckDelete)
            req.session.message = {type: "success", message: `Het deck "${deckDelete}" is verwijderd.`};
            return req.session.save(() => {
                res.redirect("/decks");
            });
        }
        
        if (newDeckName) {
            const userDecks = await getUserDecks("dennis");
            if (userDecks && userDecks.includes(newDeckName)) {
                req.session.message = {type: "error", message: `De naam "${newDeckName}" is al in gebruik.`};
                return req.session.save(() => {
                    res.redirect("/decks");
                });
            }
            else {
                await changeDeckName("dennis", oldDeckName, newDeckName)
                return req.session.save(() => {
                res.redirect("/decks");
                });
            }
        }

        if (deckName) {
            const userDecks = await getUserDecks("dennis");
            if (userDecks && userDecks.includes(deckName)) {
                req.session.message = {type: "error", message: `De naam "${deckName}" is al in gebruik.`};
                return req.session.save(() => {
                    res.redirect("/decks");
                });
            } else {
                newDeck = true;
                await addNewDeck("dennis", deckName)
            }

        } else {
            deckName = req.body.nameEdit;
        }

        res.redirect(`/newDeck?deckName=${encodeURIComponent(deckName)}&newDeck=${newDeck}`);
    
    });
    

    return router;
}
