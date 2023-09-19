import { getClientrId, getClientrInfo } from "$lib/server/main.js";
import { redirect } from "@sveltejs/kit";


export async function load({cookies, url}) {
    if(url.searchParams.get("state") != cookies.get("state")){
        throw redirect(307, "/authorization/login");
    }
    cookies.delete("state", {path: "/"});

    const token = url.searchParams.get("code") || ""; // hardcode
    cookies.set("token", token, {path: "/"});

    const userInfo = await getClientrInfo(token);
    const userId = await getClientrId(token);

    if(!userId){
        throw redirect(307, "/");
    }
    if(!userInfo){
        throw redirect(307, "/");
    }
    cookies.set("userId", userId, {path: "/"});
    cookies.set("user", userInfo.username, {path: "/"})    
    throw redirect(307, "/my-task");
}