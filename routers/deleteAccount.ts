import express, { Express } from "express";
import { User } from "../types";
import { login, deleteUser } from "../database";

export function deleteAccountRouter() {
    const router = express.Router();

    router.get("/", async (req, res) => {
        res.render("deleteAccount", {
            title: "delete account",
            user: null
        });
    });
    router.post("/delete", async (req, res) => {
        req.session.destroy(() => {
            console.log("Sessie verwijderd");
        });
        const username: string = req.body.username; // Veranderd van email naar username
        const password: string = req.body.password;
        try {
            let user: User | null = await login(username, password); // Gebruik username voor de login
            if(user){
                deleteUser(username, password);
                delete user.password; // Verwijder het wachtwoord voordat je het gebruikersobject verzendt
                req.session.user = user;
                res.render("deleteAccount", {
                    title: "delete account",
                    loggedIn: true,
                    user: user,
                    loginSuccesOrFailed: "Login"
                });
            } else {
                console.log("Login mislukt."); // Log als de inloggegevens onjuist zijn
                res.render("deleteAccount", {
                    title: "delete account",
                    loggedIn: false,
                    user: null,
                    loginSuccesOrFailed: "Login mislukt"
                });
            }
        } catch (e: any) {
            console.error("Fout bij het inloggen:", e); // Log eventuele fouten bij het inloggen
            res.render("deleteAccount", {
                title: "delete account",
                loggedIn: false,
                user: null,
                loginSuccesOrFailed: "Login mislukt"
            });
        }
    });

    return router;
}