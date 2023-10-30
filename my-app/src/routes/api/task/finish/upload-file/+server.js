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

        if (fs.existsSync(`./files/upload/efrog_${curent_sesion}`)) {
            fse.removeSync(`./files/upload/efrog_${curent_sesion}`);
        }
        fs.mkdirSync(`./files/upload/efrog_${curent_sesion}`);

        let targetFilePath = `./files/upload/efrog_${curent_sesion}/${file.name}`;
        const fileBuffer = await file.arrayBuffer();
        fs.writeFileSync(targetFilePath, new Uint8Array(fileBuffer));

        let zip = new AdmZip(targetFilePath);
        zip.extractAllTo("./files/upload/efrog_" + curent_sesion + "/");
        fs.unlinkSync(targetFilePath);

        let main_path = `./files/upload/efrog_${curent_sesion}/`;

        //Check folder with task about nesessary folders and files
        const directories = [
            // general_info
            'general_info', 'general_info/name.txt', 'general_info/time_limit.txt', 'general_info/memory_limit.txt',
            // statement
            'statement', 'statement/statement.tex',
            // examples
            'examples', 'examples/input', 'examples/output',
            // tests
            'tests', 'tests/input', 'tests/output'
        ];

        for(let i = 0; i < directories.length; i++) {
            if (!fs.existsSync(main_path + directories[i])) {
                fse.removeSync(main_path);
                return json({ error: `There are not ${directories[i]}` }, { status: 404 });  
            }
        }

        // Process general info
        name = fs.readFileSync(main_path + 'general_info/name.txt', 'utf-8');
        time_limit = fs.readFileSync(main_path + 'general_info/time_limit.txt' , 'utf-8');
        memory_limit = fs.readFileSync(main_path + 'general_info/memory_limit.txt', 'utf-8');
    
        if(!checkValue(time_limit, 1, 10)){
            return json({ error: `Time must be between 1 and 10 seconds` }, { status: 406 });  
        }
        if(!checkValue(memory_limit, 4, 1024)){
            return json({ error: `Memory must be between 4 and 1024 MB` }, { status: 406 });
        }

        // Process statement
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

        // Process test cases
        test = [];
        const testCases = [
            { inputPath: 'examples/input/', outputPath: 'examples/output/', status: "Opened" },
            { inputPath: 'tests/input/', outputPath: 'tests/output/', status: "Closed" }
        ];
        
        for (const testCase of testCases) {
            const inputPath = main_path + testCase.inputPath;
            const outputPath = main_path + testCase.outputPath;
            const inputFiles = fs.readdirSync(inputPath);
        
            for (const currentFile of inputFiles) {
                const inputFilePath = inputPath + currentFile;
                const outputFilePath = outputPath + currentFile;
        
                if (fs.existsSync(outputFilePath)) {
                    const input = fs.readFileSync(inputFilePath, 'utf-8');
                    const output = fs.readFileSync(outputFilePath, 'utf-8');
                    const id = test.length + 1;
                    test.push({ test_id: id, input, output, status: testCase.status });
                } else {
                    fse.removeSync(main_path);
                    return json({ error: `Test${currentFile} exists in ${testCase.inputPath}, but does not exist in ${testCase.outputPath}` }, { status: 404 });  
                }
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
        let main_path = `./files/upload/efrog_${curent_sesion}/`;
        fse.removeSync(main_path);
    }
}