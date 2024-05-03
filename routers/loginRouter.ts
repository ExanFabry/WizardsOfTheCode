import express, { Express } from "express";
import { User } from "../types";
import { login } from "../database";
import { secureMiddleware } from "../secureMiddleware";

export function loginRouter() {
    const router = express.Router();

    router.get("/login", async (req, res) => {
        res.render("loginForm", {
            user: null
        });
    });

    router.post("/login", async (req, res) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        try {
            let user: User = await login(email, password);
            delete user.password; // Remove password from user object. Sounds like a good idea.
            req.session.user = user;
            res.redirect("/loginForm")
        } catch (e: any) {
            res.redirect("/loginForm");
        }
    });

    router.post("/logout", secureMiddleware, async (req, res) => {
        req.session.destroy((err) => {
            res.redirect("/login");
        });
    });

    return router;
}