import { json } from '@sveltejs/kit';
import fse from 'fs-extra';
import { getClientrId } from '$lib/server/main';
import { authorization} from '$lib/server/check.js';
import { spawnSync } from 'child_process';
import path from 'path';

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
        // Get task arhive and make base64 to give it into child process
        const file = formData.get('file');
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
        const targetFileName = 'src/lib/upload/efrog.js';
        const currentDirectory = path.resolve();
        const scriptPath = path.resolve(currentDirectory, targetFileName);

        const inputData = JSON.stringify({
            base64String,
            curent_sesion,
            currentDirectory,
            fileName
        });
        
        const options = {
            input: inputData, 
            stdio: 'pipe',
            uid: 65534
        };
        
        const result = spawnSync(command, [scriptPath], options);
        // console.log(result.stdout.toString());
        // console.log(result.stderr.toString());
        if (result.status === 0) {
            console.log(result.stdout.toString())
            const data = JSON.parse(result.stdout.toString());
            console.log(data)
            if(data.error){
                return json({ error: data.error }, { status: data.status });
            }
            else{
                return(json(data));
            }
        } else{
            console.log(result.stderr);
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
        const main_path = `./files/upload/efrog_${curent_sesion}/`;

        try {
            await fse.remove(main_path);
        } catch (error) {
            console.error(`Error removing folder: ${main_path}`, error);
        }
    }
}