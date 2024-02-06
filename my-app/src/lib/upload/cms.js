const fs = require('fs');
const fse = require('fs-extra');
const AdmZip = require('adm-zip');
const yaml = require('js-yaml');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Чтение данных из stdin
rl.on('line', (input) => {
    // Ваш код обработки данных
    const data = JSON.parse(input)

    const res = processFile(data.base64String, data.curent_sesion, data.currentDirectory, data.fileName, data.taskName);
    // const res = JSON.stringify({status: 404, error: `There are not directories[i`})
    if(typeof res == 'string'){
        console.log(res);
    }
    else{
        console.error(res.error);
    }

    // Закрытие интерфейса чтения данных из stdin
    rl.close();
});

function checkValue(value, min, max) {
    const regex = /^\d+$/;

    if (!regex.test(value)) {
    return false; 
    }

    const numericValue = parseFloat(value);

    if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
        return true; 
    }

    return false; 
}

function processFile(base64String, curent_sesion, main_dir, fileName, taskName) {
    try{
        let name, time_limit, memory_limit, statement, input_statement, output_statement, note;
        let test = [];

        if (fs.existsSync(`${main_dir}/files/upload/cms_${curent_sesion}`)) {
            fse.removeSync(`${main_dir}/files/upload/cms_${curent_sesion}`);
        }
        fs.mkdirSync(`${main_dir}/files/upload/cms_${curent_sesion}`);

        let targetFilePath = `${main_dir}/files/upload/cms_${curent_sesion}/${fileName}`;

        const fileBuffer = Buffer.from(base64String, 'base64');
        fs.writeFileSync(targetFilePath, fileBuffer);
        
        let zip = new AdmZip(targetFilePath);
        zip.extractAllTo(`${main_dir}/files/upload/cms_${curent_sesion}/`);
        fs.unlinkSync(targetFilePath);

        let main_path = `./files/upload/cms_${curent_sesion}/`;
        const contests =  fs.readdirSync(main_path);
        main_path = `${main_path}${contests[0]}/`;

        //Check folder with task about nesessary folders and files

        const directories = [
            taskName, `${taskName}/task.yaml`,
            `${taskName}/input`, `${taskName}/output`, `${taskName}/sol`, `${taskName}/statement`,
            `${taskName}/statement/statement.tex`,
        ]; 

        for(let i = 0; i < directories.length; i++) {
            if (!fs.existsSync(main_path + directories[i])) {
                return(JSON.stringify({status: 404, error: `There are not ${directories[i]}`})); 
            }
        }

        main_path = main_path + taskName + "/";
        // Process general info
        let task = yaml.load(fs.readFileSync(main_path + 'task.yaml', 'utf-8'));

        const publicTestcases = task.public_testcases.split(',').map(item => parseInt(item.trim(), 10));
    
        name = task.name;
        time_limit = task.time_limit;
        memory_limit = task.memory_limit;

        if(!checkValue(time_limit, 1, 10)){
            return(JSON.stringify({status: 406, error: `Time must be between 1 and 10 seconds`}));  
        }
        if(!checkValue(memory_limit, 4, 1024)){
            return(JSON.stringify({status: 406, error: `Memory must be between 4 and 1024 MB`}));
        }

        // Process statement
        statement = fs.readFileSync(main_path + 'statement/statement.tex', 'utf-8');
        input_statement = "";
        output_statement = "";
        note = "";

        // Process test cases
        test = [];
        
        for(let i = 0; i < task.n_input; i++) {
            if(!fs.existsSync(main_path + `input/input${i}.txt`)) {
                return(JSON.stringify({status: 404, error: `File input${i}.txt does not exist`}));
            }
            if(!fs.existsSync(main_path + `output/output${i}.txt`)) {
                return(JSON.stringify({status: 404, error: `File output${i}.txt does not exist`}));
            }
    
            let input = fs.readFileSync(main_path + `input/input${i}.txt`, 'utf8');
            let output = fs.readFileSync(main_path + `output/output${i}.txt`, 'utf8');
            let status = "Closed";
    
            if(publicTestcases.includes(i)) {
                status = "Opened";
            }
    
            test.push({test_id: i + 1, input: input, output: output, status: status});
        }

        return(JSON.stringify({name, time_limit, memory_limit, statement, input_statement, output_statement, note, test}));
    }
    catch(e){
        console.error(e)
        return({error: e})
    }
    
}