import { json } from '@sveltejs/kit';
import { generate_formula } from '$lib/database/katex';

import * as db from '$lib/database/database'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {statement, input_statement, output_statement, note, id} = await request.json();
    let check_statement = statement.split("$$")
    for(let i = 0; i < check_statement.length; i ++){
        if(i % 2 == 0){
            if(!generate_formula(check_statement[i])){
                return json("Формула введена некоректно")
            }
        }
    }
    await db.send_ecran(`UPDATE task SET statement = ?, input_statement = ?, output_statement = ?, note = ? WHERE id = ?;`, [statement, input_statement, output_statement, note, id]);
    return json("Зміни збережені");
}


