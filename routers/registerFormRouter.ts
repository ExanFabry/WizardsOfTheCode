import express from "express";
import { User } from "../types";
// ---------------------------------
export function registerFormRouter() {
    const router = express.Router();
    const user : User | null = null;
    router.get("/", (req, res) => {
        res.render("registerForm", {
            title: "Registreer",
            user: user
        })
    });
    return router;
}