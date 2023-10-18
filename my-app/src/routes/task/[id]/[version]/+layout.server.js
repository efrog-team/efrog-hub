import { authorization } from '$lib/server/check.js';
import { redirect } from '@sveltejs/kit';
import * as db from '$lib/database/database';
import { getTaskAuthors } from '$lib/server/main';

export async function load({ cookies, params }) {
    // Перевірка чи зареєстрований користувач
    const token = cookies.get('token');
    if (!token) {
        throw redirect(307, '/access-denied');
    }

    // Перевірка чи користувач має права на редагування задачі
    const user_id = cookies.get('userId');
    const task_id = params.id;
    const verdict = await authorization(task_id, user_id);

    if (!verdict) {
        throw redirect(307, '/access-denied');
    }

    // Отримання даних задачі з бази даних
    const task = (await db.send_ecran(
        `SELECT name, time_limit, memory_limit, statement, input_statement, output_statement, note  
        FROM task 
        WHERE task_id = ? AND version = ?`, 
        [task_id, params.version]
    ))[0];

    if (!task) {
        throw redirect(307, '/not-found');
    }

    const test = await db.send_ecran(
        `SELECT test_id, input, output, status 
        FROM test 
        WHERE task_id = ? AND version = ?`, 
        [task_id, params.version]);

    const version = db.send_ecran(
        `SELECT version, version_name 
        FROM task 
        WHERE task_id = ?`, 
        [task_id]
    );

    let author = await db.send_ecran(
        `SELECT user_id, status 
        FROM author 
        WHERE task_id = ?`, 
        [task_id]
    );
    author = await getTaskAuthors(author);

    return { task_id, task, test, version, author };
}