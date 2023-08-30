import * as db from '$lib/database/database'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
    const task_id = params.id;
    // Отримання даних задачі з бази даних
    const test = await db.send(`SELECT input, output FROM test WHERE task_id = '${task_id}' AND status = 'Opened'`);
    let task = await db.send_ecran(`SELECT name, time_limit, memory_limit, statement, input_statement, output_statement, note FROM task WHERE id = ?`, [task_id]);
    task = task[0]
    return {test, task};
}