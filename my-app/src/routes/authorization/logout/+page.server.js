import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({cookies}) {
    cookies.delete("token", { path: '/' });
    cookies.delete("user", { path: '/' });
    cookies.delete("userId", { path: '/' });
    throw redirect(307, "/");
}