import { clientUrl } from '$lib/server/config';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
    throw redirect(307, `${clientUrl}/create-task`);
} 