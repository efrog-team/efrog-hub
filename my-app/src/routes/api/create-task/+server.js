import { json } from '@sveltejs/kit';
import * as db from '$lib/database/database'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {userId, name} = await request.json();

    let taskId = await db.send_ecran(
        `SELECT MAX(task_id) FROM task`);

    taskId = Number(taskId[0]["MAX(task_id)"]) + 1;
    
    await db.send_ecran(
        `INSERT INTO task 
        (task_id, auth_id, name) 
        VALUES (?, ?, ?)`, 
        [taskId, userId, name]);

    await db.send_ecran(
        `INSERT INTO author 
        (task_id, user_id, status)
        VALUES (?, ?, ?)`, 
        [taskId, userId, "author"]);

    return json(taskId);
}
