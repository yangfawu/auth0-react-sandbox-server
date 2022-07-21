import axios from "axios";
import { auth, claimIncludes } from "express-oauth2-jwt-bearer";
import { Request } from "express";

const NAMESPACE = `https://SOME-UNIQUE-NAMESPACE-FOR-CUSTOM-CLAIM.com`;

export const jwtCheck = auth({
    issuerBaseURL: `${process.env.AUTH0_DOMAIN}/`,
    audience: process.env.AUTH0_AUDIENCE,
});

// export enum Permissions {
//     EditProfile = "edit-profile",
//     EditOtherProfile = "edit-other-profile",
//     CreateSession = "create-session",
//     PostThreadQuestion = "post-thread-question"
// }

/* Role Names are what you see tokens. */
export enum Roles {
    USER = "USER",
    ADMIN = "ADMIN",
    INTERN = "INTERN",
    CHAMPION = "CHAMPION"
}

/* Role IDs are what you need assign/remove from users. */
export enum RoleIds {
    // USER role_id intentionally left out
    ADMIN = "rol_webivLfBx4BKkMxl",
    INTERN = "rol_U21MQVcOqNMVE7Wz",
    CHAMPION = "rol_drJUrIfiYsxCGjzl"
}

export const hasRoles = (...roles: Roles[]) => claimIncludes(`${NAMESPACE}/roles`, ...roles);

let MGMT_API_ACCESS_TOKEN: string | null = null;
export const getMGMT_API_ACCESS_TOKEN = () => {
    if (process.env.MGMT_API_ACCESS_TOKEN) {
        MGMT_API_ACCESS_TOKEN = process.env.MGMT_API_ACCESS_TOKEN;
        return;
    }
    axios.request({
        method: 'POST',
        url: `${process.env.AUTH0_ISSUER}oauth/token`,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: `${process.env.AUTH0_CLIENT_ID}`,
            client_secret: `${process.env.AUTH0_CLIENT_SECRET}`,
            audience: `${process.env.AUTH0_ISSUER}api/v2/`
        })
    }).then(res => {
        MGMT_API_ACCESS_TOKEN = res.data.access_token;
        console.log(`Retrieved new MGMT_API_ACCESS_TOKEN: ${MGMT_API_ACCESS_TOKEN}`);
    }).catch(console.error);
}

const editRoles = async (method: "DELETE" | "POST", userId: string, roles: string[]) => {
    if (!MGMT_API_ACCESS_TOKEN)
        throw new Error("MGMT_API_ACCESS_TOKEN is missing.");
    await axios.request({
        method,
        url: `${process.env.AUTH0_ISSUER}api/v2/users/${userId}/roles`,
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${MGMT_API_ACCESS_TOKEN}`,
            'cache-control': 'no-cache'
        },
        data: { roles }
    }).catch(console.error);
}
export const assignRoles = (userId: string, roles: RoleIds[]) => editRoles("POST", userId, roles);
export const removeRoles = (userId: string, roles: RoleIds[]) => editRoles("DELETE", userId, roles);

export const exposeAuth0 = (req: Request) => req.auth?.payload;