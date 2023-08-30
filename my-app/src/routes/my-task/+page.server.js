import * as jwt from 'jsonwebtoken';
import  {config} from '$lib/server/config';
import {authorization} from '$lib/server/check.js'
import { redirect } from '@sveltejs/kit';
import * as db from '$lib/database/database'

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies}) {
    // Перевірка чи зареєстрований користувач та якщо зареєстрований отримання токену
    const token = cookies.get('token');
    if (!token){
        throw redirect(307, "/access-denied")
    }
    const user_id = cookies.get('userId');
    // Отримання даних  про задачі які може редагувати користувач з бази даних
    let query = await db.send(`SELECT task_id, status FROM author WHERE user_id = '${user_id}'`)
    for(let i = 0; i < query.length; i++){
        let task_id = query[i].task_id
        const answ = await db.send(`SELECT name FROM task WHERE id = '${task_id}'`)
        let name = answ[0].name
        query[i] = {...query[i], name}
    }
    return {query};
}