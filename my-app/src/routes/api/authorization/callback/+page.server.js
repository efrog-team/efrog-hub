import { serverUrl } from "$lib/server/config.js";
import { request } from "$lib/server/main.js";
import { redirect } from "@sveltejs/kit";
import * as db from '$lib/database/database'

export async function load({cookies, url}) {
    if(url.searchParams.get("state") != cookies.get("state")){
        throw redirect(307, "/authorization/login");
    }
    cookies.delete("state", {path: "/"});

    const token = url.searchParams.get("code") || ""; // hardcode

    cookies.set("token", token, {path: "/"});

    const userInfo = await request("GET", serverUrl + "/users/me", { Authorization: token });
    
    let userId =  await db.send_ecran("SELECT id FROM user WHERE login = ?", [userInfo.username]);
    userId = userId[0].id
    
    cookies.set("userId", userId, {path: "/"});
    cookies.set("user", userInfo.username, {path: "/"})    
    throw redirect(307, "/my-task");
}