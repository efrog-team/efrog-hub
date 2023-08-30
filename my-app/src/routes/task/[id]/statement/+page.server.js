import * as db from '$lib/database/database'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
    const task_id = params.id;
    // Отримання даних задачі з бази даних
    let task = await db.send(`SELECT statement, input_statement, output_statement, note FROM task WHERE id = '${task_id}'`)
    task = task[0]
    return {task_id, task};
}