import { json } from '@sveltejs/kit';
import fs from 'fs';
import AdmZip from 'adm-zip';
import yaml from 'js-yaml';


let name, time_limit, memory_limit, statement, input_statement, output_statement, note;
let test = [];

function clear_dir (main_path) {
    fs.rmdir( main_path, { recursive:true }, (err) => { 
        console.error(err); 
      });
}
function check(value, min, max) {
    const regex = /^(\d+(\.\d*)?|\.\d+)$/;

    if (!regex.test(value)) {
    return false; 
    }

    const numericValue = parseFloat(value);

    if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
        return true; 
    }

    return false; 
}

/** @type {import('./$types').RequestHandler} */
export async function POST( {request, cookies} ) {

    const formData = await request.formData();
    const file = formData.get('file');
    const taskName = formData.get('taskName');
    const curent_sesion = cookies.get("token");
    test = [];

    if (fs.existsSync("./static/download/"+ curent_sesion)){
        clear_dir ("./static/download/"+ curent_sesion);
    }
    fs.mkdirSync("./static/download/"+ curent_sesion);

    let targetFilePath = "./static/download/" + curent_sesion + "/" + file.name;
    const fileBuffer = await file.arrayBuffer();
    fs.writeFileSync(targetFilePath, new Uint8Array(fileBuffer));

    let zip = new AdmZip(targetFilePath);
    zip.extractAllTo("./static/download/" + curent_sesion + "/");
    fs.unlinkSync(targetFilePath);


    let main_path = "./static/download/"+ curent_sesion;
    let error_path = "./static/download/" + curent_sesion;

    const contests =  fs.readdirSync(main_path);

    main_path = main_path + "/"+ contests[0] + "/";

    

    // перевіряємо директорію контесту на перелік обов'язкових файлів та директорій
    if (!fs.existsSync(main_path + taskName)){
        clear_dir(error_path);
        return json({ error: `Directory ${taskName} does not exist` }, { status: 404 });
    }

    main_path = main_path + taskName + "/";

    if (!fs.existsSync(main_path + "task.yaml")){
        clear_dir(error_path);
        return json({ error: `File task.yaml does not exist` }, { status: 404 });
    }

    let directories = ["input", "output", "sol", "statement"];

    for(let i = 0; i < directories.length; i++){
        if (!fs.existsSync(main_path + directories[i])){
            clear_dir(error_path);
            return json({ error: `Directory ${taskName} does not exist` }, { status: 404 });
        }
    }

    if(!fs.existsSync(main_path + 'statement/statement.tex')){
        clear_dir(error_path);
        return json({ error: `File statement.tex does not exist` }, { status: 404 });
    }

  
    // Записуємо дані
    let task = yaml.load(fs.readFileSync(main_path + 'task.yaml', 'utf-8'));

    const publicTestcases = task.public_testcases.split(',').map(item => parseInt(item.trim(), 10));

    name = task.name;
    time_limit = task.time_limit;
    memory_limit = task.memory_limit;

    if(!check(time_limit, 1, 10)){
        return json("Час має бути між 1 да 10 секундами");
    }
    if(!check(memory_limit, 4, 1024)){
        return json("Пам'ять має бути між 4 да 1024 МБ");
    }


    statement = fs.readFileSync(main_path + 'statement/statement.tex', 'utf-8');
    input_statement = "";
    output_statement = "";
    note = "";

    for(let i = 0; i < task.n_input; i++){
        if(!fs.existsSync(main_path + `input/input${i}.txt`)){
            clear_dir(error_path);
            return json({ error: `File input${i}.txt does not exist` }, { status: 404 });
        }
        if(!fs.existsSync(main_path + `output/output${i}.txt`)){
            clear_dir(error_path);
            return json({ error: `File output${i}.txt does not exist` }, { status: 404 });
        }

        let input = fs.readFileSync(main_path + `input/input${i}.txt`, 'utf8');
        let output = fs.readFileSync(main_path + `output/output${i}.txt`, 'utf8');
        let status = "Closed";


        if(publicTestcases.includes(i)){
            status = "Opened";
        }

        test.push({test_id: i + 1, input: input, output: output, status: status});
    
    }

    clear_dir(error_path);

    return json({name, time_limit, memory_limit, statement, input_statement, output_statement, note, test});
}
