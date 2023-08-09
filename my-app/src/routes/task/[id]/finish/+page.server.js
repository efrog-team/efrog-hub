import * as jwt from 'jsonwebtoken';
import  {config} from '$lib/config';
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
    return {task_id};
}