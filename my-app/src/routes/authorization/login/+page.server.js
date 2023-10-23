import { randomString } from '$lib/server/check';
import { redirect } from '@sveltejs/kit';
import { authUrl, clientUrl } from '$lib/server/config';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({cookies}) {
    const state = randomString();
    cookies.delete("state", { path: '/' });
    cookies.set("state", state, { path: '/' });

    throw redirect(303, `${authUrl}/en/login?response_type=code&redirect_uri=${clientUrl}/api/authorization/callback&state=${state}`);
} 