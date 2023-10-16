import { json } from '@sveltejs/kit';
import fs from 'fs';
import fse from 'fs-extra';
import AdmZip from 'adm-zip';
import path from 'path';
import yaml from 'js-yaml';


let name, time_limit, memory_limit, statement, input_statement, output_statement, note;
let test = [];

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

    const curent_sesion = cookies.get("token");
    test = [];
    let main_path = "./static/download/"+ curent_sesion;

    if (fs.existsSync(main_path)){
        fse.removeSync(main_path);
    }
    fs.mkdirSync("./static/download/"+ curent_sesion);

    let targetFilePath = "./static/download/" + curent_sesion + "/" + file.name;
    const fileBuffer = await file.arrayBuffer();
    fs.writeFileSync(targetFilePath, new Uint8Array(fileBuffer));

    let zip = new AdmZip(targetFilePath);
    zip.extractAllTo("./static/download/" + curent_sesion + "/");
    fs.unlinkSync(targetFilePath);

    const language = formData.get('language');

    // перевіряємо архів на наявність необхідного файлу
    if (!fs.existsSync(main_path + "/statements/" + language + "/problem-properties.json")){
        fse.removeSync(main_path);
        return json({ error: `File ${language}/problem-properties.json does not exist` }, { status: 404 });
    }
    
    // Записуємо дані
    let task =  JSON.parse(fs.readFileSync(main_path + "/statements/" + language + "/problem-properties.json", "utf-8"));

    name = task.name;
    time_limit = task.timeLimit / 1000;
    memory_limit = task.memoryLimit / 1_048_576;

    if(!check(time_limit, 1, 10)){
        return json("Час має бути між 1 да 10 секундами");
    }
    if(!check(memory_limit, 4, 1024)){
        return json("Пам'ять має бути між 4 да 1024 МБ");
    }

    statement = task.legend;
    input_statement = task.input;
    output_statement = task.output;
    note = task.notes;

    for(let i = 0; i < task.sampleTests.length; i++){
        test.push({test_id: test.length + 1, input: task.sampleTests[i].input, output: task.sampleTests[i].output, status: "Opened" })
    }

    fs.readdirSync(`${main_path}/tests`).forEach((file) => {
        if(file.split(".")[1] == "a"){
            if (!fs.existsSync(`${main_path}/tests/${file.split(".")[0]}`)){
                fse.removeSync(main_path);
                return json({ error: `There are answer ${file}, but no test ${file.split(".")[0]}` }, { status: 404 });
            }

            let input = fs.readFileSync(`${main_path}/tests/${file.split(".")[0]}`, "utf-8");
            let output = fs.readFileSync(`${main_path}/tests/${file}`, "utf-8");

            test.push({test_id: test.length + 1, input: input, output: output, status: "Closed" })
        }
    });

    try{
        fse.removeSync(main_path);
    }
    catch(error){
        throw error;
    }
    

    return json({name, time_limit, memory_limit, statement, input_statement, output_statement, note, test});
}
