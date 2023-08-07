import { json } from '@sveltejs/kit';
import  {config} from '$lib/config';

import * as db from '$lib/database/database'
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const generate_access_token = (id, login) => {
    const payload = {
        id,
        login
    }
    return jwt.sign(payload, config.secret, {expiresIn: "24h"})
}
/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
    const { login,  password } = await request.json();

    const candidate = await db.send(`SELECT * FROM user WHERE login = '${login}'`);
    let user = candidate[0];

    if (candidate.length == 0 || user.login != login){
        return json("Такого логіна не існує");
    }

    
    const valid_password = bcrypt.compareSync(password, user.password);
    if(!valid_password){
        return json("Неправильний пароль");
    }

    const token = generate_access_token(user.id, user.login);
    cookies.set("token", token,  {path: "/" });
    return json("Ви увійшли в акаунт " + user.login);
}
