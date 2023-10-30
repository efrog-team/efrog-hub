import { json } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import fs from 'fs';
import fse from 'fs-extra';
import { getClientrId } from '$lib/server/main';
import { authorization, checkValue } from '$lib/server/check.js';

let name, time_limit, memory_limit, statement, input_statement, output_statement, note;
let test = [];

/** @type {import('./$types').RequestHandler} */
export async function POST( {request, cookies} ) {
    try{
        // Check authorization
        const formData = await request.formData();
        const curent_sesion = cookies.get('token');
        const task_id =  formData.get('task_id');

        const userId = await getClientrId(curent_sesion);
        const verdict = await authorization(task_id, userId);

        if (!verdict) {
            return json({ error: `Tou are not author of that task` }, { status: 403 });
        }

        // Get task arhive and save them into folder
        const file = formData.get('file');

        if (fs.existsSync(`./files/upload/polygon_${curent_sesion}`)) {
            fse.removeSync(`./files/upload/polygon_${curent_sesion}`);
        }
        fs.mkdirSync(`./files/upload/polygon_${curent_sesion}`);

        let targetFilePath = `./files/upload/polygon_${curent_sesion}/${file.name}`;
        const fileBuffer = await file.arrayBuffer();
        fs.writeFileSync(targetFilePath, new Uint8Array(fileBuffer));

        let zip = new AdmZip(targetFilePath);
        zip.extractAllTo("./files/upload/polygon_" + curent_sesion + "/");
        fs.unlinkSync(targetFilePath);

        let main_path = `./files/upload/polygon_${curent_sesion}/`;

        //Check folder with task about nesessary folders and files
        const language = formData.get('language');

        if (!fs.existsSync(`${main_path}/statements/${language}/problem-properties.json`)) {
            fse.removeSync(main_path);
            return json({ error: `File ${language}/problem-properties.json does not exist` }, { status: 404 });
        }

        if (!fs.existsSync(`${main_path}/tests`)) {
            fse.removeSync(main_path);
            return json({ error: `Directory tests does not exist` }, { status: 404 });
        }

        // Process general info
        let task =  JSON.parse(fs.readFileSync(`${main_path}/statements/${language}/problem-properties.json`, "utf-8"));

        name = task.name;
        time_limit = task.timeLimit / 1000 || 1;
        memory_limit = task.memoryLimit / 1_048_576 || 256;

        if(!checkValue(time_limit, 1, 10)) {
            return json({ error: `Time must be between 1 and 10 seconds` }, { status: 406 });  
        }
        if(!checkValue(memory_limit, 4, 1024)) {
            return json({ error: `Memory must be between 4 and 1024 MB` }, { status: 406 });
        }

        // Process statement
        statement = task.legend;
        input_statement = task.input || "";
        output_statement = task.output || "";
        note = task.notes || "";
    
        if(!statement) {
            return json({ error: `There are not statement` }, { status: 404 });
        }

        // Process test cases
        test = [];

        fs.readdirSync(`${main_path}/tests`).forEach((file) => {
            if(file.split(".")[1] == "a"){
                if (!fs.existsSync(`${main_path}/tests/${file.split(".")[0]}`)) {
                    fse.removeSync(main_path);
                    return json({ error: `There are answer ${file}, but no test ${file.split(".")[0]}` }, { status: 404 });
                }
    
                const input = fs.readFileSync(`${main_path}/tests/${file.split(".")[0]}`, "utf-8");
                const output = fs.readFileSync(`${main_path}/tests/${file}`, "utf-8");
    
                test.push({test_id: test.length + 1, input: input, output: output, status: "Closed" });
            }
        });

        // Return task data
        return json({name, time_limit, memory_limit, statement, input_statement, output_statement, note, test});

    } catch (error) {
        // In instance of error return error
        console.log(error);
        return json({ error: `There are problems with file uploading. Please try one more time` }, { status: 500 });  
    } finally {
        // Delete folder with the problem in any way
        const curent_sesion = cookies.get('token');
        let main_path = `./files/upload/polygon_${curent_sesion}/`;
        fse.removeSync(main_path);
    }
}