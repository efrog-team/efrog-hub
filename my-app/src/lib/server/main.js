import { serverUrl } from "./config";

export async function request (method, path, headers, data) {
    const res = await fetch(path, {
        method: method,
        if(data){
            body: JSON.stringify(data);
        },
        if(headers){
            headers: headers;
        }
    });
    return res
    }


export async function getUserId (username) {
    const res = await request("GET", `${serverUrl}/users/${username}/id`);
    if(res.ok) {
        const id = await res.json()
        return id.id;
    }

    return false;
}

export async function getClientrId (token) {
    const res = await request("GET", `${serverUrl}/users/me/id`, {Authorization: token});
    if(res.ok) {
        const id = await res.json()
        return id.id;
    }

    return false;
}

export async function getTaskAuthors (author) {
    for(let i = 0; i < author.length; i++){
        const res = await request("GET", `${serverUrl}/users/id/${author.user_id}`, {Authorization: token});
        if(res.ok) {
            const id = await res.json()
            return id.id;
        }
    
        return false;
    }

}
