import { json } from '@sveltejs/kit';
import * as db from '$lib/database/database';
import AdmZip from 'adm-zip';
import fs from 'fs';
import fse from 'fs-extra';
import { getClientrId } from '$lib/server/main';
import { authorization } from '$lib/server/check.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
    try {
        // Check authorization
        const curent_sesion = cookies.get('token');
        const { task_id, version } = await request.json();

        const userId = await getClientrId(curent_sesion);

        const verdict = await authorization(task_id, userId);

        if (!verdict) {
            return json({ error: `Tou are not author of that task` }, { status: 403 });
        }

        // Get task info from DB
        const test = await db.send_ecran(
            `SELECT test_id, input, output, status 
            FROM test 
            WHERE task_id = ? AND version = ?`, 
            [task_id, version]);
        const task = await db.send_ecran(
            `SELECT name, time_limit, memory_limit, statement, input_statement, output_statement, note 
            FROM task 
            WHERE task_id = ? AND version = ?`, 
            [task_id, version]);


        const { name, time_limit, memory_limit, statement, input_statement, output_statement, note } = task[0];

        // Create dir for future .ZIP file
        if (fs.existsSync(`./files/download/${curent_sesion}`)) {
            fse.removeSync(`./files/download/${curent_sesion}`);
        }
        fs.mkdirSync(`./files/download/${curent_sesion}`);

        let main_path = `./files/download/${curent_sesion}/`;

        const directories = ['general_info', 'statement', 'tests', 'tests/input', 'tests/output', 'examples', 'examples/input', 'examples/output'];

        for (let i = 0; i < directories.length; i++) {
            fs.mkdirSync(main_path + directories[i]);
        }

        // Create files with general info and statement
        const problem = [name, String(time_limit), String(memory_limit), statement, input_statement, output_statement, note];
        const filesPath = ['general_info/name.txt', 'general_info/time_limit.txt', 'general_info/memory_limit.txt', 'statement/statement.tex', 'statement/input_statement.tex', 'statement/output_statement.tex', 'statement/note.tex']

        for (let i = 0; i < problem.length; i++) {
            fs.writeFileSync(main_path + filesPath[i], problem[i]);
        }

        // Create files with test cases
        for (let i = 0; i < test.length; i++) {
            let test_case = test[i];
            if (test_case.status == "Closed") {
                fs.writeFileSync(`${main_path}tests/input/${test_case.test_id}.txt`, test_case.input);
                fs.writeFileSync(`${main_path}tests/output/${test_case.test_id}.txt`, test_case.output);
            } else {
                fs.writeFileSync(`${main_path}examples/input/${test_case.test_id}.txt`, test_case.input);
                fs.writeFileSync(`${main_path}examples/output/${test_case.test_id}.txt`, test_case.output);
            }
        }

        // Create archive with the task
        const zip = new AdmZip();
        zip.addLocalFolder(main_path);
        const zipBuffer = zip.toBuffer();
        const file = new Blob([zipBuffer], { type: 'application/zip' });

        // Return archive
        return new Response(file, {
            headers: {
                'Content-Type': 'application/zip'
            }
        });
    } catch (error) {
        // In instance of error return error
        console.log(error);
        return json({ error: `There are problems with file downloading. Please try one more time` }, { status: 500 });  
    } finally {
        // Delete folder with the problem in any way
        const curent_sesion = cookies.get('token');
        let main_path = `./files/download/${curent_sesion}/`;
        fse.removeSync(main_path);
    }
}