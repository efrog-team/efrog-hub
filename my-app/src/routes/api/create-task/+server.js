import { json } from '@sveltejs/kit';


import * as db from '$lib/database/database'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {id, name} = await request.json();
    const answ = await db.send(`INSERT INTO task (auth_id, name) VALUES ('${id}', '${name}');`);
    const task_id = answ.insertId;
    await db.send(`INSERT INTO author (task_id, user_id, status) VALUES ('${task_id}', '${id}', 'author');`);
    return json(task_id);
}
