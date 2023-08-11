import * as jwt from 'jsonwebtoken';
import  {config} from '$lib/server/config';
import {authorization} from '$lib/server/check.js'
import { redirect } from '@sveltejs/kit';
import * as db from '$lib/database/database'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, params }) {
    // Перевірка чи зареєстрований користувач
    const token = cookies.get('token');
    if (!token){
        throw redirect(300, "/access-denied")
    }
    // Перевірка чи має користувач права на редагування задачі
    let user_info = jwt.verify(token, config.secret);
    let task_id = params.id
    let user_id = user_info.id
    const verdict = await authorization(task_id, user_id)
    if(!verdict){
        throw redirect(300, "/access-denied")
    }
    // Отримання даних задачі з бази даних
    const test = await db.send(`SELECT input, output FROM test WHERE task_id = '${task_id}' AND status = 'Opened'`);
    let task = await db.send_ecran(`SELECT name, time_limit, memory_limit, statement, input_statement, output_statement, note FROM task WHERE id = ?`, [task_id]);
    task = task[0]
    return {test, task};
}