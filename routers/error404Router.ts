import express from "express";
import session from "../session";
import { flashMiddleware } from "../flashMiddleware";

const app = express();
app.use(session);
app.use(flashMiddleware);

export function error404Router() {
    const router = express.Router();
    router.get("/", async (req, res) => { 
        res.render("decks", {
            title: "Error: Not Found"
        })
    })
}