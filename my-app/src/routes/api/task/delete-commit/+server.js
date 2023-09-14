import { json, redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import * as db from '$lib/database/database'
import { clientUrl } from '$lib/server/config';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {task_id, version} = await request.json();
    await db.send_ecran(`DELETE FROM task WHERE task_id = ? AND version > ?`, [task_id, version]);
    await db.send_ecran(`DELETE FROM test WHERE task_id = ? AND version > ?`, [task_id, version]);
    return json(version);
}
