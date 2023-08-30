import {authorization} from '$lib/server/check.js';
import { redirect } from '@sveltejs/kit';
/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, params }) {
    // Перевірка чи зареєстрований користувач
    const token = cookies.get('token');
    if (!token){
        throw redirect(307, "/access-denied");
    }

    // Перевірка чи користувач має права на редагування задачі
    const user_id = cookies.get('userId');
    const task_id = params.id;

    const verdict = await authorization(task_id, user_id);
    if(!verdict){
        throw redirect(307, "/access-denied");
    }
}