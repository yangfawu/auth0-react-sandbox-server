import { Router } from "express";
import { greetRouter } from "./greetRouter";

export const PUBLIC_ROUTES: { [k: string]: Router } = {
    "greet": greetRouter
};