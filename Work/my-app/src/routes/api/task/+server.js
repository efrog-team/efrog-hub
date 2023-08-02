import { json } from '@sveltejs/kit';

import fs from 'fs';
import AdmZip from 'adm-zip';

let curent_sesion = 'curent_sesion'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    let {task_name, time_limit, memory_limit, statement, input_statement, output_statement, note, test} = await request.json();

    fs.mkdirSync("./static/public/"+ curent_sesion);

    let main_path = "./static/public/"+ curent_sesion + "/";

    fs.mkdirSync(main_path + 'general_info');
    fs.mkdirSync(main_path + 'statement');
    fs.mkdirSync(main_path + 'tests');
    fs.mkdirSync(main_path + 'tests/input');
    fs.mkdirSync(main_path + 'tests/output');
    fs.mkdirSync(main_path + 'examples');
    fs.mkdirSync(main_path + 'examples/input');
    fs.mkdirSync(main_path + 'examples/output');


    fs.writeFileSync(main_path + 'general_info/name.txt', task_name);
    fs.writeFileSync(main_path + 'general_info/time_limit.txt', time_limit);
    fs.writeFileSync(main_path + 'general_info/memory_limit.txt', memory_limit);
    
    fs.writeFileSync(main_path + 'statement/statement.txt', statement);
    fs.writeFileSync(main_path + 'statement/input_statement.txt', input_statement);
    fs.writeFileSync(main_path + 'statement/output_statement.txt', output_statement);
    fs.writeFileSync(main_path + 'statement/note.txt', note);
    
    for(let i = 0; i< test.length; i++){
        let test_case = test[i];
        if (test_case.status == "Closed"){
            fs.writeFileSync(main_path + 'tests/input/' + test_case.id+'.txt', test_case.input);
            fs.writeFileSync(main_path + 'tests/output/' + test_case.id+'.txt', test_case.output);
        }
        else{
            fs.writeFileSync(main_path + 'examples/input/' + test_case.id+'.txt', test_case.input);
            fs.writeFileSync(main_path + 'examples/output/' + test_case.id+'.txt', test_case.output);
        }

    }
    const zip = new AdmZip();
    zip.addLocalFolder(main_path);
    fs.writeFileSync(main_path + 'output.zip', zip.toBuffer());


    return json(main_path + 'output.zip');
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    fs.rmdir( main_path, { recursive:true }, (err) => { 
        console.error(err); 
      });
    return new Response(String(1))
}




