import { json } from '@sveltejs/kit';
import * as db from '$lib/database/database'


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {task, commitName, task_id} = await request.json();
    let lastVersion = await db.send_ecran(
        `SELECT  version, name, time_limit, memory_limit, statement, input_statement, output_statement, note
        FROM task
        WHERE task_id = ?
        ORDER BY version DESC
        LIMIT 1`, [task_id]);
    lastVersion = lastVersion[0];
    const fieldsToCompare = ['name', 'time_limit', 'memory_limit', 'statement', 'input_statement', 'output_statement', 'note'];
    let i = 0;
    for (const field of fieldsToCompare) {
        if (lastVersion[field] !== task[field]) {
            i ++;
        }
    }

    const lastTest = await db.send_ecran(
        `SELECT test_id, input, output, status 
        FROM test 
        WHERE task_id = ? AND version = ?`, 
        [task_id, lastVersion.version]);

    if(JSON.stringify(lastTest) != JSON.stringify(task.test)){
        i ++;
    }

    if(i === 0){
        return json("Дані не змінилися");
    }
    await db.send_ecran(
        `INSERT INTO task 
        (name, time_limit, memory_limit, statement, input_statement, output_statement, note, version, version_name, task_id) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [task.name, task.time_limit, task.memory_limit, task.statement, task.input_statement, task.output_statement, task.note, lastVersion.version + 1, commitName, task_id]);

    for(let i = 0; i < task.test.length; i++){
        await db.send_ecran(
            `INSERT INTO test 
            (task_id, test_id, input, output, status, version) 
            VALUES (?, ?, ?, ?, ?, ?)`, 
            [task_id, task.test[i].test_id, task.test[i].input, task.test[i].output, task.test[i].status, lastVersion.version + 1]); 
    }
                           
    return json("Дані збережені");
}
