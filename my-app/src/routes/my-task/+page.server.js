import { redirect } from '@sveltejs/kit';
import * as db from '$lib/database/database';
import { getClientrId } from '$lib/server/main';
import { serverUrl } from '$lib/server/config';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
    // Перевірка чи зареєстрований користувач та якщо зареєстрований отримання токену
    const token = cookies.get('token');
    if (!token){
        throw redirect(307, "/access-denied")
    }
    
    const  userId  = cookies.get("userId")

    // Отримання даних  про задачі які може редагувати користувач з бази даних
    let version
    let query = await db.send_ecran(
        `SELECT task_id, status 
        FROM author 
        WHERE user_id = ?`, 
        [userId]);
    for(let i = 0; i < query.length; i++){
        let taskId = query[i].task_id
        const answ = await db.send_ecran(
            `SELECT name 
            FROM task 
            WHERE task_id = ?`, 
            [taskId]);
            
        let name = answ[answ.length - 1].name
        version = answ.length - 1;
        query[i] = {...query[i], name, version}
    }
    return {query};
}