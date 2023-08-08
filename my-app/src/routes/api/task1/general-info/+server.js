import { json } from '@sveltejs/kit';


import * as db from '$lib/database/database'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {name, time_limit, memory_limit, id} = await request.json();
    await db.send(`UPDATE task SET name = '${name}', time_limit = '${time_limit}', memory_limit = '${memory_limit}' WHERE id = ${id};`);
    return json("Зміни збережені");
}


