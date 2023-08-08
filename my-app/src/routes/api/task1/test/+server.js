import { json } from '@sveltejs/kit';

import * as db from '$lib/database/database'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {test, id} = await request.json();
    await db.send(`DELETE FROM test WHERE task_id = ${id};`)
    for(let i = 0; i < test.length; i++){
        await db.send(`INSERT INTO test (task_id, test_id, input, output, status) VALUES ('${id}', '${test[i].test_id}', '${test[i].input}', '${test[i].output}', '${test[i].status}')`)
    }
    return json("Зміни збережені");
}


