import * as jwt from 'jsonwebtoken';
import  {config} from '$lib/server/config';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
    const token = cookies.get('token');
    let user_info;
    if (token){
        user_info = jwt.verify(token, config.secret);
    }
    return user_info;
}