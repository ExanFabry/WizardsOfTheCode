import express, { Express } from "express";
import { User } from "../types";
import { login } from "../database";
import { secureMiddleware } from "../secureMiddleware";

export function loginRouter() {
    const router = express.Router();

    router.post("/loginForm/login", async (req, res) => {
        const username: string = req.body.username; // Veranderd van email naar username
        const password: string = req.body.password;
        try {
            let user: User | null = await login(username, password); // Gebruik username voor de login
            if(user){
                delete user.password; // Verwijder het wachtwoord voordat je het gebruikersobject verzendt
                req.session.user = user;
                res.render("loginForm", {
                    title: "login",
                    loggedIn: true,
                    user: user
                });
            } else {
                console.log("Login mislukt."); // Log als de inloggegevens onjuist zijn
                res.render("loginForm", {
                    title: "login",
                    loggedIn: false,
                    user: null
                });
            }
        } catch (e: any) {
            console.error("Fout bij het inloggen:", e); // Log eventuele fouten bij het inloggen
            res.render("loginForm", {
                title: "login",
                loggedIn: false,
                user: null
            });
        }
    });

    return router;
}