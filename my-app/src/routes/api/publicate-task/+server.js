import { json } from '@sveltejs/kit';
import * as db from '$lib/database/database';
import { authorization } from '$lib/server/check';
import { serverUrl } from '$lib/server/config';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const {taskId} = await request.json();
    const authorizationHeader = request.headers.get('Authorization');
    if (!authorizationHeader) {
        return json({ error: "There are no token" }, { status: 422 });
    }
    if (!taskId) {
        return json({ error: "There are no task id" }, { status: 422 });
    }

    const token = authorizationHeader.replace('Bearer ', '');
    let  userId  = await fetch(`${serverUrl}/users/me/id`,
        {method: 'GET',
        headers:
            {Authorization: token}
    });

    if(userId.ok){
        userId = await userId.json();
    }
    else{
        return json({ error: "Incorect token" }, { status: 401 });
    }
    

    if(!authorization(taskId, userId)){
        return json({ error: "You are not author of task" }, { status: 406 });
    }

    let version = await db.send_ecran(
        `SELECT MAX(version) 
        FROM task 
        WHERE task_id = ?`, 
        [taskId]);
    

    version = version[0]['MAX(version)'];
    if(version === null){
        return json({ error: "Does not exist" }, { status: 404 });
    }

    let task = await db.send_ecran(
        `SELECT name, time_limit, memory_limit, statement, input_statement, output_statement, note  
        FROM task 
        WHERE task_id = ? AND version = ?`, 
        [taskId, version]);

    let test = await db.send_ecran(
        `SELECT test_id, input, output, status 
        FROM test 
        WHERE task_id = ? AND version = ?`, 
        [taskId, version]);
    

    task = task[0];

    return json({task, test});
}