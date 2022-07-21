import { Router } from "express";

export const greetRouter = Router();

greetRouter.get("/", (req, res) => {
    res.send("Hello, this is the public endpoint!");
});