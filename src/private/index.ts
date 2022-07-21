import { Router } from "express";
import { registerFormRouter } from "./registerFormRouter";

export const PRIVATE_ROUTES: { [k: string]: Router } = {
    "form": registerFormRouter
};