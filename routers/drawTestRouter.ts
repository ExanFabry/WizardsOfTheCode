import express from "express";


export function drawTestRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("drawTest", {
            title: "Draw Test"
        })
    });

    return router;
}