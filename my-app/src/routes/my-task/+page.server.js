import { redirect } from '@sveltejs/kit';
import * as db from '$lib/database/database'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies}) {
    // Перевірка чи зареєстрований користувач та якщо зареєстрований отримання токену
    // const token = cookies.get('token');
    // if (!token){
    //     throw redirect(307, "/access-denied")
    // }
    cookies.set("userId", 2, {path: "/"});
    const  user_id = cookies.get('userId');

    // Отримання даних  про задачі які може редагувати користувач з бази даних
    let version
    let query = await db.send(`SELECT task_id, status FROM author WHERE user_id = '${user_id}'`)
    for(let i = 0; i < query.length; i++){
        let task_id = query[i].task_id
        const answ = await db.send(`SELECT name FROM task WHERE task_id = '${task_id}'`)
        let name = answ[answ.length - 1].name
        version = answ.length - 1;
        query[i] = {...query[i], name, version}
    }
    return {query};
}