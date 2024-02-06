import { json } from '@sveltejs/kit';
import fse from 'fs-extra';
import { getClientrId } from '$lib/server/main';
import { authorization } from '$lib/server/check.js';
import { spawnSync } from 'child_process';
import path from 'path';


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
        const language = formData.get('language');
        const fileName = file.name;
        
        const reader = file.stream().getReader();
        let chunks = [];

        while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        }

        const fileBuffer = Buffer.concat(chunks);
        const base64String = fileBuffer.toString('base64');


        const command = 'node';
        // Get patht to process file
        const targetFileName = 'src/lib/upload/polygon.js';
        const currentDirectory = path.resolve();
        const scriptPath = path.resolve(currentDirectory, targetFileName);

        const inputData = JSON.stringify({
            base64String,
            curent_sesion,
            currentDirectory,
            fileName,
            language
        });
        
        const options = {
            input: inputData, 
            stdio: 'pipe',
            uid: 65534
        };
        
        const result = spawnSync(command, [scriptPath], options);

        if (result.status === 0) {
            if (result.stdout) {
                const data = JSON.parse(result.stdout.toString());
                if(data.error){
                    console.log(data.error);
                    return json({ error: data.error }, { status: data.status });
                }
                else{
                    return(json(data));
                }
            } else {
                return json({ error: "Unexpected error occurred during reading data" }, { status: 500 });
            }

        } else{
            if (result.stderr) {
                const stderrString = result.stderr.toString();
                console.log(stderrString);
                return json({ error: stderrString }, { status: 404 });
            } else {
                return json({ error: "Unexpected error occurred" }, { status: 500 });
            }
            
        };

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