import express from "express";
import { User } from "../types";
// ---------------------------------
export function loginFormRouter() {
    const router = express.Router();
    const user : User | null = null;
    router.get("/", (req, res) => {
        res.render("loginForm", {
            title: "Login",
            user: user
        })
    });
    return router;
}