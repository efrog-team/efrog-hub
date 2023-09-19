import { serverUrl } from "./config";

export async function request (method, path, headers, data) {
    const res = await fetch(path, {
        method: method,
        if(data){
            body: JSON.stringify(data);
        },
        headers: headers
    });
    return res
    }


export async function getUserId (username) {
    const res = await request("GET", `${serverUrl}/users/${username}/id`);
    if(res.ok) {
        const id = await res.json();
        return id.id;
    }

    return false;
}

export async function getClientrId (token) {
    const res = await request("GET", `${serverUrl}/users/me/id`, {Authorization: token});
    if(res.ok) {
        const id = await res.json();
        return id.id;
    }

    return false;
}

export async function getClientrInfo (token) {
    const res = await request("GET", `${serverUrl}/users/me`, {Authorization: token});
    if(res.ok) {
        const user = await res.json();
        return user;
    }

    return false;
}


export async function getTaskAuthors (author) {
    for(let i = 0; i < author.length; i++){
        const res = await request("GET", `${serverUrl}/users/id/${author[i].user_id}`);
        if(res.ok) {
            const taskAuthor = await res.json();
            author[i] = {login: taskAuthor.username, status: author[i].status};
            break;
        }
    
        return false;
    }
    return author;

}
