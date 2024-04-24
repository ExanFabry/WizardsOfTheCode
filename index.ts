// ------------------------------------------------
import express, { Express } from "express";
import path from "path";
import { RootObject, Card } from "./types";
import { decksRouter } from "./routers/decksRouter";
import { drawTestRouter } from "./routers/drawTestRouter";
import { homeRouter } from "./routers/homeRouter";
import { landingPageRouter } from "./routers/landingPageRouter";
import { newDeckRouter } from "./routers/newDeckRouter";
import { loginFormRouter } from "./routers/loginFormRouter";
// ------------------------------------------------
const app: Express = express();
// ------------------------------------------------
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
// ------------------------------------------------
// ------------------------------------------------
app.use("/", landingPageRouter());
app.use("/addToDiscardPile", drawTestRouter());
app.use("/decks", decksRouter());
app.use("/draw", drawTestRouter());
app.use("/drawtest", drawTestRouter());
app.use("/home", homeRouter());
app.use("/loginForm", loginFormRouter());
app.use("/newDeck", newDeckRouter());
app.use("/reset", drawTestRouter());
// ------------------------------------------------
app.listen(app.get("port"), async() => {
    console.log("Server started on http://localhost:" + app.get("port"));
});
// ------------------------------------------------
/*
    BRONNEN
    -------
    Achtergrond website: Bence Kazari
    Voorbeeld deck afbeeldingen: Perchance AI Generator
    Afbeeldingen kaarten: MTG API
*/