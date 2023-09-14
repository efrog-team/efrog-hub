import { json } from '@sveltejs/kit';
import * as db from '$lib/database/database'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request}) {
    const { author, task_id} = await request.json();
    const candidate_id = await db.send(`SELECT id FROM user WHERE login = BINARY '${author}'`)
    if (candidate_id.length == 0) {
        return json("Такого логіна не існує")
    }
    const exist_author = await db.send(`SELECT user_id FROM author WHERE task_id = '${task_id}'`)
    for(let i = 0; i < exist_author.length; i++){
        if (candidate_id[0].id == exist_author[i].user_id){
            return json("Такий автор вже існує")
        }
    }
    await db.send(`INSERT INTO author (task_id, user_id, status) VALUES ('${task_id}', '${candidate_id[0].id}', 'co-author');`)
    return json("Автора додано");
}

