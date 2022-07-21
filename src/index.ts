import dotenv from "dotenv";
import express, { Express } from "express";
import { PRIVATE_ROUTES } from "./private";
import { PUBLIC_ROUTES } from "./public";
import { getMGMT_API_ACCESS_TOKEN } from "./auth0";
import { json } from "body-parser";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

app.use(json());

for (const [path, router] of Object.entries(PUBLIC_ROUTES))
    app.use(`/api/public/${path}`, router);
for (const [path, router] of Object.entries(PRIVATE_ROUTES))
    app.use(`/api/private/${path}`, router);

// @ts-ignore
app.use((err, req, res, next) => {
    if (!err)
        return;

    console.error(err)
    if (!err.status) {
        res.status(400).send(err.message);
        return;
    }

    res.status(err.status).send(err.message);
});

getMGMT_API_ACCESS_TOKEN();
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});