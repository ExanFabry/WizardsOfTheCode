import express from "express";
import { addNewDeck, changeDeckName, deleteDeck, getUserDecks, getUserDecksWithUrls } from "../database";
import session from "../session";
import { flashMiddleware } from "../flashMiddleware";

const app = express();
app.use(session);
app.use(flashMiddleware);

export function decksRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {      

        const username : string = typeof req.session.user?.username === 'string' ? req.session.user?.username : "";

        let userDecks: { title: string; urlBackground: string }[] = [];
        const result =  await getUserDecksWithUrls(username);

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
        let backgroundUrl : string = req.body.backgroundUrl;

        const username : string = typeof req.session.user?.username === 'string' ? req.session.user?.username : "";

        if (deckDelete) {
            await deleteDeck(username, deckDelete)
            req.session.message = {type: "success", message: `Het deck "${deckDelete}" is verwijderd.`};
            return req.session.save(() => {
                res.redirect("/decks");
            });
        }
        
        if (newDeckName) {
            const userDecks = await getUserDecks(username);
            if (userDecks && userDecks.includes(newDeckName)) {
                req.session.message = {type: "error", message: `De naam "${newDeckName}" is al in gebruik.`};
                return req.session.save(() => {
                    res.redirect("/decks");
                });
            }
            else {
                await changeDeckName(username, oldDeckName, newDeckName)
                return req.session.save(() => {
                res.redirect("/decks");
                });
            }
        }

        if (deckName) {
            const userDecks = await getUserDecks(username);
            if (userDecks && userDecks.includes(deckName)) {
                req.session.message = {type: "error", message: `De naam "${deckName}" is al in gebruik.`};
                return req.session.save(() => {
                    res.redirect("/decks");
                });
            } else {
                newDeck = true;
                await addNewDeck(username, deckName, backgroundUrl)
            }

        } else {
            deckName = req.body.nameEdit;
        }

        res.redirect(`/newDeck?deckName=${encodeURIComponent(deckName)}&newDeck=${newDeck}`);
    
    });
    

    return router;
}
