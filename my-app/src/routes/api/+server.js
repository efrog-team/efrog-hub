import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import * as db from '$lib/database/database'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { a, b } = await request.json();
    return json(a + b);
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const content = db.send();
    return new Response(String(content))
}

