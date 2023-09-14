import * as db from '$lib/database/database'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
    const task_id = params.id;
    // Отримання даних задачі з бази даних
    let task = await db.send_ecran(`SELECT name, time_limit, memory_limit, statement, input_statement, output_statement, note  FROM task WHERE task_id = ? AND version = ?`, [task_id, params.version]);
    let test = await db.send_ecran(`SELECT test_id, input, output, status FROM test WHERE task_id = ? AND version = ?`, [task_id, params.version]);
    task = task[0];

    let version = db.send_ecran(`SELECT version, version_name FROM task WHERE task_id = ?`, [task_id]);

    let author = await db.send_ecran(`SELECT user_id, status FROM author WHERE task_id = ?`, [task_id]);
    for(let i = 0; i < author.length; i++){
        const author_name = await db.send(`SELECT login FROM user WHERE id = '${author[i].user_id}'`);
        author[i] = {...author[i], ...author_name[0]};
    }
    return { task_id, task, test, version, author };
}