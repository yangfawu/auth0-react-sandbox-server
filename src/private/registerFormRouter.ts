import { Router } from "express";
import { assignRoles, exposeAuth0, jwtCheck, removeRoles, RoleIds } from "../auth0";

export const registerFormRouter = Router();

const determineRole = (appType: string | undefined) => {
   switch (appType) {
      case "INTERN-APPLICATION":
         return [RoleIds.INTERN];
      case "CHAMPION-APPLICATION":
         return [RoleIds.CHAMPION];
      case "ADMIN-APPLICATION":
         return [RoleIds.ADMIN];
      default:
         break;
   }
   return null;
}

registerFormRouter.post("/", jwtCheck, async (req, res) => {
   const roles = determineRole(req.body["application-type"]);
   if (!roles) {
      res.status(400).json({ message: "Invalid application type." });
      return;
   }

   const user_id = exposeAuth0(req)!.sub!;
   await assignRoles(user_id, roles);
   res.send("Thanks for submitting the application!");
});

registerFormRouter.post("/reset", jwtCheck, async (req, res) => {
   const roles = determineRole(req.body["application-type"]);
   if (!roles) {
      res.status(400).json({ message: "Invalid application type." });
      return;
   }

   const user_id = exposeAuth0(req)!.sub!;
   await removeRoles(user_id, roles);
   res.send("Removed role from your account!");
});