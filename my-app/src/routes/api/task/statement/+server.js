import { json } from '@sveltejs/kit';
import { generate_formula } from '$lib/database/katex';

import * as db from '$lib/database/database'

function check_statement (check_statement) {
    check_statement = check_statement.split("$$");
    for(let i = 0; i < check_statement.length; i ++){
        if(i % 2 != 0){
            if(!generate_formula(check_statement[i])){
                return true;
            }
        }
    }
    return false;
}
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {statementForSend, inputStatementForSend, outputStatementForSend, noteForSend, id} = await request.json();
    if(check_statement(statementForSend)  || check_statement(inputStatementForSend) || check_statement(outputStatementForSend) || check_statement(noteForSend)){
        return json("Формула введена некоректно");
    }
    await db.send_ecran(`UPDATE task SET statement = ?, input_statement = ?, output_statement = ?, note = ? WHERE id = ?;`, [statementForSend, inputStatementForSend, outputStatementForSend, noteForSend, id]);
    return json("Зміни збережені");
}


