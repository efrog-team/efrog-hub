import jwt from 'jsonwebtoken';
import { config } from '$lib/server/config';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
    try {
        const token = cookies.get('token');
        let user_info;
        if (token) {
            user_info = jwt.verify(token, config.secret);
        }
        return user_info;
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            cookies.delete("token");
            return redirect('/authorization/login');
        }
    }
}