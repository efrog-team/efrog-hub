export async function request (method, path, headers, data) {
    const res = await fetch(path, {
        method: method,
        if(data){
            body: JSON.stringify(data);
        },
        headers: headers,
    });
    const answ = await res.json();
    return answ;
}