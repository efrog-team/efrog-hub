import { json } from '@sveltejs/kit';
import fs from 'fs';
import AdmZip from 'adm-zip';
import * as db from '$lib/database/database'

let name = "";
let time_limit = "";
let memory_limit = "";
let statement = "";
let input_statement = "";
let output_statement = "";
let note = "";
let test = [];

function clear_dir (main_path) {
    fs.rmdir( main_path, { recursive:true }, (err) => { 
        console.error(err); 
      });
}

/** @type {import('./$types').RequestHandler} */
export async function POST( {request, cookies} ) {

    const formData = await request.formData();
    const file = formData.get('file');
    const task_id =  formData.get('task_id')
    const curent_sesion = cookies.get("token")
    test = [];
    fs.mkdirSync("./static/download/"+ curent_sesion);

    let targetFilePath = "./static/download/" + curent_sesion + "/" + file.name;
    const fileBuffer = await file.arrayBuffer();
    fs.writeFileSync(targetFilePath, new Uint8Array(fileBuffer));

    let zip = new AdmZip(targetFilePath);
    zip.extractAllTo("./static/download/" + curent_sesion + "/");
    fs.unlinkSync(targetFilePath);

    let main_path = "./static/download/"+ curent_sesion + "/";

    // перевіряємо директорію general_info на перелік обов'язкових файлів
    if (!fs.existsSync(main_path + 'general_info')){
        clear_dir (main_path);
        return json("Directory general_info does not exist");
    }

    if(!fs.existsSync(main_path + 'general_info/name.txt')){
        clear_dir (main_path)
        return json("File name.txt does not exist");
    }

    if(!fs.existsSync(main_path + 'general_info/time_limit.txt')){
        clear_dir (main_path);
        return json("File time_limit.txt does not exist");
    }

    if(!fs.existsSync(main_path + 'general_info/memory_limit.txt' )){
        clear_dir (main_path);
        return json("File memory_limit.txt does not exist");
    }
    
    // перевіряємо директорію statement на перелік обов'язкових файлів
    if (!fs.existsSync(main_path + 'statement')){
        clear_dir (main_path);
        return json("Directory statement does not exist");
    }

    if(!fs.existsSync(main_path + 'statement/statement.tex')){
        clear_dir (main_path);
        return json("File statement.txt does not exist");
    }

    // перевіряємо директорію examples на перелік обов'язкових файлів
    if (!fs.existsSync(main_path + 'examples')){
        clear_dir (main_path);
        return json("Directory examples does not exist");
    }
    if(!fs.existsSync(main_path + 'examples/input') && !fs.existsSync(main_path + 'examples/output')){
        clear_dir (main_path);
        return json("Incorect directories in examples");
    }
    if (fs.readdirSync(main_path + 'examples/input').length != fs.readdirSync(main_path + 'examples/output').length){
        clear_dir (main_path);
        return json("Incorect tests in examples");       
    }

    // перевіряємо директорію tests на перелік обов'язкових файлів
    if (!fs.existsSync(main_path + 'tests')){
        clear_dir (main_path);
        return json("Directory tests does not exist");
    }

    if(!fs.existsSync(main_path + 'tests/input') && !fs.existsSync(main_path + 'tests/output')){
        clear_dir (main_path);
        return json("Incorect directories in tests");
    }
    
    if (fs.readdirSync(main_path + 'tests/input').length != fs.readdirSync(main_path + 'tests/output').length){
        clear_dir (main_path);
        return json("Incorect tests in tests");
    }
    // Записуємо дані
    name = fs.readFileSync(main_path + 'general_info/name.txt', 'utf-8');
    time_limit = fs.readFileSync(main_path + 'general_info/time_limit.txt' , 'utf-8');
    memory_limit = fs.readFileSync(main_path + 'general_info/memory_limit.txt', 'utf-8');

    statement = fs.readFileSync(main_path + 'statement/statement.tex', 'utf-8');

    if(fs.existsSync(main_path + 'statement/input_statement.tex')){
        input_statement = fs.readFileSync(main_path + 'statement/input_statement.tex', 'utf-8');
    }

    if(fs.existsSync(main_path + 'statement/output_statement.tex')){
        output_statement = fs.readFileSync(main_path + 'statement/output_statement.tex', 'utf-8');
    }

    if(fs.existsSync(main_path + 'statement/note.tex')){
        note = fs.readFileSync(main_path + 'statement/note.tex', 'utf-8');
    }

    let input = fs.readdirSync(main_path + 'examples/input');
    for( let i = 0; i < input.length; i++){
        let curent_file = input[i];
        
        if(fs.existsSync( main_path + 'examples/output/' + curent_file)){

            let input = fs.readFileSync( main_path + 'examples/input/' + curent_file , 'utf-8');
            let output = fs.readFileSync( main_path + 'examples/output/' + curent_file , 'utf-8');
            let id = test.length + 1;
            test.push({test_id: id, input: input, output: output, status: "Opened"});
        }
        else{
            clear_dir (main_path)
            return json("tests " + curent_file + "exists in examples/input, but does not exist in examples/output");
        }

    }

    input = fs.readdirSync(main_path + 'tests/input');
    for( let i = 0; i < input.length; i++){
        let curent_file = input[i];
        
        if(fs.existsSync( main_path + 'tests/output/' + curent_file)){

            let input = fs.readFileSync( main_path + 'tests/input/' + curent_file , 'utf-8');
            let output = fs.readFileSync( main_path + 'tests/output/' + curent_file , 'utf-8');
            let id = test.length + 1;
            test.push({test_id: id, input: input, output: output, status: "Closed"});
        }
        else{
            clear_dir (main_path)
            return json("tests " + curent_file + "exists in tests/input, but does not exist in tests/output");
        }

    }
    clear_dir (main_path);

    await db.send(`UPDATE task SET name = '${name}', time_limit = '${time_limit}', memory_limit = '${memory_limit}', statement = '${statement}', input_statement = '${input_statement}', output_statement = '${output_statement}', note = '${note}' WHERE id = ${task_id};`);
    await db.send(`DELETE FROM test WHERE task_id = ${task_id};`)
    for(let i = 0; i < test.length; i++){
        await db.send(`INSERT INTO test (task_id, test_id, input, output, status) VALUES ('${task_id}', '${test[i].test_id}', '${test[i].input}', '${test[i].output}', '${test[i].status}')`)
    }

    return json("Задача успішно завантажена");
}
