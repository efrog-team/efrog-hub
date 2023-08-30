import * as db from '$lib/database/database'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
    const task_id = params.id;
    // Отримання даних задачі з бази даних
    const query = await db.send(`SELECT test_id, input, output, status FROM test WHERE task_id = '${task_id}'`)
    return {task_id, query};
}