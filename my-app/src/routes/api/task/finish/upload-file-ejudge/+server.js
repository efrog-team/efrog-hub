import { json } from '@sveltejs/kit';
import fs from 'fs';
import AdmZip from 'adm-zip';
import xml2js from 'xml2js';
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
    
    let main_path = "./static/download/"+ curent_sesion + "/";
    const contests =  fs.readdirSync(main_path);

    let contest_path = main_path + contests[0] + "/";

    // перевіряємо директорію контесту на перелік обов'язкових директорій
    if (!fs.existsSync(contest_path + 'statements')){
        clear_dir (main_path);
        return json({ error: "Directory statements does not exist" }, { status: 404 });
    }

    if (!fs.existsSync(contest_path + 'checkers')){
        clear_dir (main_path);
        return json({ error: "Directory checkers does not exist" }, { status: 404 });
    }

    if (!fs.existsSync(contest_path + 'tests')){
        clear_dir (main_path);
        return json({ error: "Directory tests does not exist" }, { status: 404 });
    }

    if (!fs.existsSync(contest_path + `statements/${taskName}.xml`)){
        clear_dir (main_path);
        return json({ error: `File ${taskName}.xml does not exist` }, { status: 404 });
    }
    // Записуємо дані з файлу A.xml
    const readFilePromise = new Promise((resolve, reject) => {
        fs.readFile(contest_path + "statements" + "/" + taskName + ".xml", "utf-8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    
    try {
        // Чекаємл завершення читання файлу
        const data = await readFilePromise;
        
        // трансформуємо XML у JS
        const result = await new Promise((resolve, reject) => {
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Отримання даних задачі з файлу xml
        name = result.problem.statement[0].title[0];
        time_limit = 5;
        memory_limit = 256;


        statement = processObject(result.problem.statement[0].description[0]);
        input_statement = processObject(result.problem.statement[0].input_format[0]);
        output_statement = processObject(result.problem.statement[0].output_format[0]);
        note = processObject(result.problem.statement[0].notes[0]);

        console.log(result.problem.examples)
        const examples = result.problem.examples[0].example;

        for(let i = 0; i < examples.length; i++){
            test.push({test_id: test.length + 1, input: examples[i].input[0], output: examples[i].output[0], status: "Opened"});
        }

        const userTests = fs.readdirSync(contest_path + 'tests' + "/" + taskName);
        
        for(let i = 0; i < userTests.length; i ++){

            if(userTests[i].split(".")[1] == "answ"){
                const ouput_format = fs.readFileSync(contest_path + 'tests' + "/" + taskName + "/" + userTests[i], 'utf-8');

                if (!fs.existsSync(contest_path + 'tests' + "/" + taskName + "/" + userTests[i].split(".")[0] + ".dat")){
                    clear_dir (main_path);
                    return json({ error: `There is ${userTests[i]}, but no ${userTests[i].split(".")[0] + ".dat"}`  }, { status: 404 });
                }

                const input_format = fs.readFileSync(contest_path + 'tests' + "/" + taskName + "/" + userTests[i].split(".")[0] + ".dat", 'utf-8');

                test.push({ test_id: test.length + 1, input: input_format, output: ouput_format, status: "Closed" });
            }


        }
        
        return json({ name, time_limit, memory_limit, statement, input_statement, output_statement, note, test });
    } catch (err) {
        console.error('Произошла ошибка:', err);
        return json({ error: "An error occurred" }, { status: 500 });
    } finally {
        clear_dir(main_path);
    }

}
 