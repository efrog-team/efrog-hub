import * as db from '$lib/database/database'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, params }) {
    const user_id = cookies.get('userId');
    const task_id = params.id;
    // Отримання даних задачі з бази даних
    const query = await db.send(`SELECT name, time_limit, memory_limit FROM task WHERE id = '${task_id}'`);
    let author = await db.send(`SELECT user_id, status FROM author WHERE task_id = '${task_id}'`);
    for(let i = 0; i < author.length; i++){
        const author_name = await db.send(`SELECT login FROM user WHERE id = '${author[i].user_id}'`);
        author[i] = {...author[i], ...author_name[0]};
    }
    return {task_id, query, author};
}