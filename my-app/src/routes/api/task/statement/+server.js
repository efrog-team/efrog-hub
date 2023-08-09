import { json } from '@sveltejs/kit';

import * as db from '$lib/database/database'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {statement, input_statement, output_statement, note, id} = await request.json();
    await db.send(`UPDATE task SET statement = '${statement}', input_statement = '${input_statement}', output_statement = '${output_statement}', note = '${note}' WHERE id = ${id};`);
    return json("Зміни збережені");
}


