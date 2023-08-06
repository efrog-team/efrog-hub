import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

import * as db from 'D:/Work/database/database.js'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { a, b } = await request.json();
    return json(a + b);
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const content = db.get_database();
    return new Response(String(content))
}

