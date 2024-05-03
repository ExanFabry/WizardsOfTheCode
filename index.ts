import express, { Express } from "express";
import path from "path";
import { decksRouter } from "./routers/decksRouter";
import { drawTestRouter } from "./routers/drawTestRouter";
import { homeRouter } from "./routers/homeRouter";
import { landingPageRouter } from "./routers/landingPageRouter";
import { newDeckRouter } from "./routers/newDeckRouter";
import { connect } from "./database";
import { loginFormRouter } from "./routers/loginFormRouter";
import session from "./session";
import { User } from "./types";
import { login } from "./database";
import { secureMiddleware } from "./secureMiddleware";
import { loginRouter } from "./routers/loginRouter";

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));
app.use(session);

app.set("port", process.env.PORT || 3000);

app.use("/decks", decksRouter());
app.use("/drawtest", drawTestRouter());
app.use("/draw", drawTestRouter());
app.use("/reset", drawTestRouter());
app.use("/addToDiscardPile", drawTestRouter());
app.use("/home", homeRouter());
app.use("/newDeck", newDeckRouter());
app.use("/", landingPageRouter());
app.use("/loginForm", loginFormRouter());
app.use(loginRouter());
app.use(homeRouter());
app.get("/login", (req, res) => {
    res.render("loginForm");
});
app.post("/login", async(req, res) => {
    const email : string = req.body.email;
    const password : string = req.body.password;
    try {
        let user : User = await login(email, password);
        delete user.password; 
        req.session.user = user;
        res.redirect("/")
    } catch (e : any) {
        res.redirect("/loginForm");
    }
});
app.get("/", async(req, res) => {
    if (req.session.user) {
        res.render("/loginForm", {user: req.session.user});
    } else {
        res.redirect("/login");
    }
});
app.get("/", secureMiddleware, async(req, res) => {
    res.render("index");
});
app.get("/logout", async(req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

app.listen(app.get("port"), async() => {
    await connect()
    console.log("Server started on http://localhost:" + app.get('port'));
});