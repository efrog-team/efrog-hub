import { json } from '@sveltejs/kit';
import * as db from '$lib/database/database'
import * as bcrypt from 'bcrypt'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { login, email, password } = await request.json();

    const db_log = await db.send(`SELECT login FROM user WHERE login = '${login}'`);
    if (db_log.length != 0){
        return json("Такий логін вже існує");
    }

    let hash_password = await bcrypt.hash(password, 7)
    const db_answ = await db.send(`INSERT INTO user (login, email, password) VALUES ('${login}', '${email}', '${hash_password}')`);
    return json("Акаунт успішнго створений");
}
