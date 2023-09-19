import { json } from '@sveltejs/kit';
import * as db from '$lib/database/database'
import { getUserId } from '$lib/server/main';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { author, task_id} = await request.json();

    const candidateId = await getUserId(author);

    if (!candidateId){ 
        return json("Такого лоіну не існує");
    }    

    const exist_author = await db.send_ecran(
        `SELECT user_id 
        FROM author 
        WHERE task_id = ?`,
        [task_id]);

    for(let i = 0; i < exist_author.length; i++){
        if (candidateId == exist_author[i].user_id){
            return json("Такий автор вже існує");
        }
    }
    await db.send_ecran(
        `INSERT INTO author 
        (task_id, user_id, status) 
        VALUES (?, ?, ?)`,
        [task_id, candidateId, 'co-author']);
    return json("Автора додано");
}

