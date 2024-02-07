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
        (task_id, name, version, version_name, time_limit, memory_limit, statement, input_statement, output_statement, note, is_checker) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [taskId, name, 0, 'Start', 1, 256, '', '', '', '', 0]);

    await db.send_ecran(
        `INSERT INTO author 
        (task_id, user_id, status)
        VALUES (?, ?, ?)`, 
        [taskId, userId, "author"]);

    return json(taskId);
}
