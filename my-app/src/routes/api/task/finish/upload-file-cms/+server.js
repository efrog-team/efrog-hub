import { json } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import yaml from 'js-yaml';
import fs from 'fs';
import fse from 'fs-extra';
import { getClientrId } from '$lib/server/main';
import { authorization, checkValue } from '$lib/server/check.js';

let name, time_limit, memory_limit, statement, input_statement, output_statement, note;
let test = [];

/** @type {import('./$types').RequestHandler} */
export async function POST( {request, cookies} ) {
    try {
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

        if (fs.existsSync(`./files/upload/cms_${curent_sesion}`)) {
            fse.removeSync(`./files/upload/cms_${curent_sesion}`);
        }
        fs.mkdirSync(`./files/upload/cms_${curent_sesion}`);

        let targetFilePath = `./files/upload/cms_${curent_sesion}/${file.name}`;
        const fileBuffer = await file.arrayBuffer();
        fs.writeFileSync(targetFilePath, new Uint8Array(fileBuffer));

        let zip = new AdmZip(targetFilePath);
        zip.extractAllTo("./files/upload/cms_" + curent_sesion + "/");
        fs.unlinkSync(targetFilePath);

        let main_path = `./files/upload/cms_${curent_sesion}/`;
        let error_path = "./static/download/cms_" + curent_sesion;
        const contests =  fs.readdirSync(main_path);
        main_path = `${main_path}${contests[0]}/`;

        //Check folder with task about nesessary folders and files
        const taskName = formData.get('taskName');
        const directories = [
            taskName, `${taskName}/task.yaml`,
            `${taskName}/input`, `${taskName}/output`, `${taskName}/sol`, `${taskName}/statement`,
            `${taskName}/statement/statement.tex`,
        ]; 

        for(let i = 0; i < directories.length; i++) {
            if (!fs.existsSync(main_path + directories[i])) {
                fse.removeSync(error_path);
                return json({ error: `There are not ${directories[i]}` }, { status: 404 });  
            }
        }

        main_path = main_path + taskName + "/";
        
        // Process general info
        let task = yaml.load(fs.readFileSync(main_path + 'task.yaml', 'utf-8'));

        const publicTestcases = task.public_testcases.split(',').map(item => parseInt(item.trim(), 10));
    
        name = task.name;
        time_limit = task.time_limit;
        memory_limit = task.memory_limit;

        if(!checkValue(time_limit, 1, 10)){
            return json({ error: `Time must be between 1 and 10 seconds` }, { status: 406 });  
        }
        if(!checkValue(memory_limit, 4, 1024)){
            return json({ error: `Memory must be between 4 and 1024 MB` }, { status: 406 });
        }

        // Process statement
        statement = fs.readFileSync(main_path + 'statement/statement.tex', 'utf-8');
        input_statement = "";
        output_statement = "";
        note = "";

        // Process test cases
        test = [];
        
        for(let i = 0; i < task.n_input; i++) {
            if(!fs.existsSync(main_path + `input/input${i}.txt`)) {
                fse.removeSync(error_path);
                return json({ error: `File input${i}.txt does not exist` }, { status: 404 });
            }
            if(!fs.existsSync(main_path + `output/output${i}.txt`)) {
                fse.removeSync(error_path);
                return json({ error: `File output${i}.txt does not exist` }, { status: 404 });
            }
    
            let input = fs.readFileSync(main_path + `input/input${i}.txt`, 'utf8');
            let output = fs.readFileSync(main_path + `output/output${i}.txt`, 'utf8');
            let status = "Closed";
    
            if(publicTestcases.includes(i)) {
                status = "Opened";
            }
    
            test.push({test_id: i + 1, input: input, output: output, status: status});
        }

        // Return task data
        return json({name, time_limit, memory_limit, statement, input_statement, output_statement, note, test});
    } catch (error) {
        // In instance of error return error
        console.log(error);
        return json({ error: `There are problems with file uploading. Please try one more time` }, { status: 500 });  
    } finally {
        // Delete folder with the problem in any way
        const curent_sesion = cookies.get('token');
        let error_path = `./files/upload/cms_${curent_sesion}/`;
        fse.removeSync(error_path);
    }
}