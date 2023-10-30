import { json } from '@sveltejs/kit';
import AdmZip from 'adm-zip';
import xml2js from 'xml2js';
import fs from 'fs';
import fse from 'fs-extra';
import { getClientrId } from '$lib/server/main';
import { authorization, checkValue } from '$lib/server/check.js';

let name, time_limit, memory_limit, statement, input_statement, output_statement, note;
let test = [];

function processObject(obj) {
    let result = '';
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
  
        result += value;

        if (key === 'p' || key === 'br') {
          result += '\n';
        }
      }
    }
    if (result.endsWith('\n')) {
        result = result.slice(0, -1);
      }

    return result;
  }

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

        if (fs.existsSync(`./files/upload/ejudge_${curent_sesion}`)) {
            fse.removeSync(`./files/upload/ejudge_${curent_sesion}`);
        }
        fs.mkdirSync(`./files/upload/ejudge_${curent_sesion}`);

        let targetFilePath = `./files/upload/ejudge_${curent_sesion}/${file.name}`;
        const fileBuffer = await file.arrayBuffer();
        fs.writeFileSync(targetFilePath, new Uint8Array(fileBuffer));

        let zip = new AdmZip(targetFilePath);
        zip.extractAllTo("./files/upload/ejudge_" + curent_sesion + "/");
        fs.unlinkSync(targetFilePath);

        let main_path = `./files/upload/ejudge_${curent_sesion}/`;
        let error_path = "./static/upload/ejudge_" + curent_sesion;
        const contests =  fs.readdirSync(main_path);
        main_path = `${main_path}${contests[0]}/`;


        //Check folder with task about nesessary folders and files
        const taskName = formData.get('taskName');
        const directories = ['statements', 'tests', `statements/${taskName}.xml`];

        for(let i = 0; i < directories.length; i++) {
            if (!fs.existsSync(main_path + directories[i])) {
                fse.removeSync(error_path);
                return json({ error: `There are not ${directories[i]}` }, { status: 404 });  
            }
        }
    
        // Process general info
        const readFilePromise = new Promise((resolve, reject) => {
            fs.readFile(`${main_path}statements/${taskName}.xml`, "utf-8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        const data = await readFilePromise;

        const result = await new Promise((resolve, reject) => {
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    
        name = result.problem.statement[0].title[0];
        time_limit = 5;
        memory_limit = 256;

    

        // Process statement
        statement = processObject(result.problem.statement[0].description[0]);
        input_statement = processObject(result.problem.statement[0].input_format[0]);
        output_statement = processObject(result.problem.statement[0].output_format[0]);
        note = processObject(result.problem.statement[0].notes[0]);

        // Process test cases
        test = [];
        const examples = result.problem.examples[0].example;

        for (let i = 0; i < examples.length; i++) {
            test.push({
                test_id: test.length + 1,
                input: examples[i].input[0],
                output: examples[i].output[0],
                status: "Opened"
            });
        }

        const userTests = fs.readdirSync(`${main_path}tests/${taskName}`);

        for (let i = 0; i < userTests.length; i++) {
            if (userTests[i].split(".")[1] == "answ") {
                const output_format = fs.readFileSync(`${main_path}tests/${taskName}/${userTests[i]}`, 'utf-8');

                const input_format_file = `${userTests[i].split(".")[0]}.dat`;
                const input_format_path = `${main_path}tests/${taskName}/${input_format_file}`;

                if (!fs.existsSync(input_format_path)) {
                    fse.removeSync(error_path);
                    return json({ error: `There is ${userTests[i]}, but no ${input_format_file}` }, { status: 404 });
                }

                const input_format = fs.readFileSync(input_format_path, 'utf-8');
                test.push({ test_id: test.length + 1, input: input_format, output: output_format, status: "Closed" });
            }
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
        let error_path = "./files/upload/ejudge_" + curent_sesion;
        fse.removeSync(error_path);
    }
}