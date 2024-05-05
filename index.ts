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
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config(); 
const app : Express = express();


app.use(cookieParser());
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
app.get("/loginForm/login", (req, res) => {
    res.render("loginForm", {
        title: "login form"
    });
});
app.post("/loginForm/login", async(req, res) => {
    const email : string = req.body.username;
    const password : string = req.body.password;
    try {
        res.cookie("username", req.body.username);
        let user : User = await login(email, password);
        delete user.password; 
        req.session.user = user;
        res.render("loginForm", {
            title: "login",
            user: user,
            loggedIn: true
        });
        //res.redirect("/")
    } catch (e : any) {
        res.render("loginForm", {
            title: "login",
            user: null,
            loggedIn: true
        });
    }
});
app.get("/", async(req, res) => {
    if (req.session.user) {
        res.render("/loginForm", {
            title: "login",
            user: req.session.user,
            loggedIn: true
        });
    } else {
        res.render("loginForm", {
            title: "login",
            user: null,
            loggedIn: true
        });
    }
});
app.get("/", secureMiddleware, async(req, res) => {
    res.render("index");
});
app.get("/logout", async(req, res) => {
    req.session.destroy(() => {
        res.render("loginForm", {
            title: "login",
            user: undefined
        });
    });
});

app.listen(app.get("port"), async() => {
    await connect()
    console.log("Server started on http://localhost:" + app.get('port'));
});