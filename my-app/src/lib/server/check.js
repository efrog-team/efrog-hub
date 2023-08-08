import * as db from '$lib/database/database'

export let authorization = async (task_id, user_id) => {
    const authors = await db.send(`SELECT user_id FROM author where task_id = ${task_id};`);
    for(let i = 0; i < authors.length; i++){
        if(authors[i].user_id == user_id) {
           return true;
        }
    }
    return false;
}