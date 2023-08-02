import { json } from '@sveltejs/kit';
import fs from 'fs';
import AdmZip from 'adm-zip';

let name = "";
let time_limit = "";
let memory_limit = "";
let statement = "";
let input_statement = "";
let output_statement = "";
let note = "";
let tests = [];

let curent_sesion = 'curent_sesion'

function clear_dir (main_path) {
    fs.rmdir( main_path, { recursive:true }, (err) => { 
        console.error(err); 
      });
}

/** @type {import('./$types').RequestHandler} */
export async function POST( {request} ) {
    const formData = await request.formData();
    const file = formData.get('file');

    fs.mkdirSync("./static/download/"+ curent_sesion);

    let targetFilePath = "./static/download/" + curent_sesion + "/" + file.name;
    const fileBuffer = await file.arrayBuffer();
    fs.writeFileSync(targetFilePath, new Uint8Array(fileBuffer));

    let zip = new AdmZip(targetFilePath);
    zip.extractAllTo("./static/download/" + curent_sesion + "/");
    fs.unlinkSync(targetFilePath);

    let main_path = "./static/download/"+ curent_sesion + "/";
    // проверяем и получаем содержимое из general_info
    if (fs.existsSync(main_path + 'general_info') == true){

        if(fs.existsSync(main_path + 'general_info/name.txt') == true){

            name = fs.readFileSync(main_path + 'general_info/name.txt', 'utf-8');

            if(fs.existsSync(main_path + 'general_info/time_limit.txt') == true){

                time_limit = fs.readFileSync(main_path + 'general_info/time_limit.txt' , 'utf-8');

                if(fs.existsSync(main_path + 'general_info/memory_limit.txt' ) == true){

                    memory_limit = fs.readFileSync(main_path + 'general_info/memory_limit.txt', 'utf-8');
                }
                else{
                    clear_dir (main_path)
                    return json("File memory_limit.txt does not exist");
                }
            }
            else{
                clear_dir (main_path)
                return json("File time_limit.txt does not exist");
            }
        }
        else{
            clear_dir (main_path)
            return json("File name.txt does not exist");
        }
    }
    else {
        clear_dir (main_path)
        return json("Directory general_info does not exist");
    }

    // проверяем и получаем содержимое из statement
    if (fs.existsSync(main_path + 'statement') == true){

        if(fs.existsSync(main_path + 'statement/statement.txt') == true){

            statement = fs.readFileSync(main_path + 'statement/statement.txt', 'utf-8');

            if(fs.existsSync(main_path + 'statement/input_statement.txt') == true){

                input_statement = fs.readFileSync(main_path + 'statement/input_statement.txt' , 'utf-8');
            }

            if(fs.existsSync(main_path + 'statement/output_statement.txt') == true){

                output_statement = fs.readFileSync(main_path + 'statement/output_statement.txt' , 'utf-8');
            }

            if(fs.existsSync(main_path + 'statement/note.txt') == true){

                note = fs.readFileSync(main_path + 'statement/note.txt' , 'utf-8');
            }

        }
        else{
            clear_dir (main_path)
            return json("File statement.txt does not exist");
        }
    }
    else {
        clear_dir (main_path)
        return json("Directory statement does not exist");
    }

    // проверяем и получаем содержимое из examples
    if (fs.existsSync(main_path + 'examples') == true){

        if(fs.existsSync(main_path + 'examples/input') == true && fs.existsSync(main_path + 'examples/output') == true){

            if (fs.readdirSync(main_path + 'examples/input').length == fs.readdirSync(main_path + 'examples/output').length){

                let input = fs.readdirSync(main_path + 'examples/input');
                for( let i = 0; i < input.length; i++){
                    let curent_file = input[i];
                    
                    if(fs.existsSync( main_path + 'examples/output/' + curent_file) == true){

                        let input = fs.readFileSync( main_path + 'examples/input/' + curent_file , 'utf-8');
                        let output = fs.readFileSync( main_path + 'examples/output/' + curent_file , 'utf-8');
                        let id = curent_file.substring(0, curent_file.length - 4);
                        tests.push({id: id, input: input, output: output, status: "Opened"});
                    }
                    else{
                        clear_dir (main_path)
                        return json("test " + curent_file + "exists in examples/input, but does not exist in examples/output");
                    }

                }
            }
            else{
                clear_dir (main_path)
                return json("Incorect tests in examples");
            }
        }
        else{
            clear_dir (main_path)
            return json("Incorect directories in examples");
        }
    }
    else {
        clear_dir (main_path)
        return json("Directory examples does not exist");
    }

    // проверяем и получаем содержимое из tests
    if (fs.existsSync(main_path + 'tests') == true){

        if(fs.existsSync(main_path + 'tests/input') == true && fs.existsSync(main_path + 'tests/output') == true){

            if (fs.readdirSync(main_path + 'tests/input').length == fs.readdirSync(main_path + 'tests/output').length){
                
                let input = fs.readdirSync(main_path + 'tests/input');
                for( let i = 0; i < input.length; i++){
                    let curent_file = input[i];
                    
                    if(fs.existsSync( main_path + 'tests/output/' + curent_file) == true){

                        let input = fs.readFileSync( main_path + 'tests/input/' + curent_file , 'utf-8');
                        let output = fs.readFileSync( main_path + 'tests/output/' + curent_file , 'utf-8');
                        let id = curent_file.substring(0, curent_file.length - 4);
                        tests.push({id: id, input: input, output: output, status: "Closed"});
                    }
                    else{
                        clear_dir (main_path)
                        return json("test " + curent_file + "exists in tests/input, but does not exist in tests/output");
                    }

                }
            }
            else{
                clear_dir (main_path)
                return json("Incorect tests in tests");
            }
        }
        else{
            clear_dir (main_path)
            return json("Incorect directories in tests");
        }
    }
    else {
        clear_dir (main_path)
        return json("Directory tests does not exist");
    }
    const res = {name, time_limit, memory_limit, statement, input_statement, output_statement, note, tests};

    clear_dir (main_path)
    return json(res);
}