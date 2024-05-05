import express from "express";


export function landingPageRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("landingPage", {
            title: "Landing Page",
            user: req.session.user
        })
    });

    return router;
}