import { serverUrl } from "$lib/server/config.js";
import { getClientrId, request } from "$lib/server/main.js";
import { redirect } from "@sveltejs/kit";
import * as db from '$lib/database/database'


export async function load({cookies, url}) {
    if(url.searchParams.get("state") != cookies.get("state")){
        throw redirect(307, "/authorization/login");
    }
    cookies.delete("state", {path: "/"});

    const token = url.searchParams.get("code") || ""; // hardcode

    cookies.set("token", token, {path: "/"});

    // const userInfo = await request("GET", serverUrl + "/users/me", { Authorization: token });
    
    // let  userId  = await fetch(`${serverUrl}/users/me/id`,
    // {method: 'GET',
    // headers:
    //     {Authorization: token}
    // });
    
    // userId = await userId.json();
    // console.log(userId)
    
    cookies.set("userId", 1, {path: "/"});
    cookies.set("user", "admin", {path: "/"})    
    throw redirect(307, "/my-task");
}