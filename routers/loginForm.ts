import express from "express";
// ---------------------------------
export function loginRouter() {
    const router = express.Router();
    router.get("/", (req, res) => {
        res.render("loginForm", {
            title: "Welcome"
        })
    });
    return router;
}