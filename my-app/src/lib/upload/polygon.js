const fs = require('fs');
const fse = require('fs-extra');
const AdmZip = require('adm-zip');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Чтение данных из stdin
rl.on('line', (input) => {
    // Ваш код обработки данных
    const data = JSON.parse(input)

    const res = processFile(data.base64String, data.curent_sesion, data.currentDirectory, data.fileName, data.language);
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

function processFile(base64String, curent_sesion, main_dir, fileName, language) {
    try{
        let name, time_limit, memory_limit, statement, input_statement, output_statement, note;
        let test = [];

        if (fs.existsSync(`./files/upload/polygon_${curent_sesion}`)) {
            fse.removeSync(`./files/upload/polygon_${curent_sesion}`);
        }
        fs.mkdirSync(`./files/upload/polygon_${curent_sesion}`);

        let targetFilePath = `${main_dir}/files/upload/polygon_${curent_sesion}/${fileName}`;

        const fileBuffer = Buffer.from(base64String, 'base64');
        fs.writeFileSync(targetFilePath, fileBuffer);
        
        let zip = new AdmZip(targetFilePath);
        zip.extractAllTo(`${main_dir}/files/upload/polygon_${curent_sesion}/`);
        fs.unlinkSync(targetFilePath);
        
        let main_path = `${main_dir}/files/upload/polygon_${curent_sesion}/`;

        //Check folder with task about nesessary folders and files


        if (!fs.existsSync(`${main_path}/statements/${language}/problem-properties.json`)) {
            return(JSON.stringify({status: 404, error: ` There are not statements/${language}/problem-properties.json does not exist`}));
        }

        if (!fs.existsSync(`${main_path}/tests`)) {
            return(JSON.stringify({status: 404, error: `Directory tests does not exist`}));
        }

        // Process general info
        let task =  JSON.parse(fs.readFileSync(`${main_path}/statements/${language}/problem-properties.json`, "utf-8"));

        name = task.name;
        time_limit = task.timeLimit / 1000 || 1;
        memory_limit = task.memoryLimit / 1_048_576 || 256;

        if(!checkValue(time_limit, 1, 10)) {
            return(JSON.stringify({status: 406, error: `Time must be between 1 and 10 seconds`}));  
        }
        if(!checkValue(memory_limit, 4, 1024)) {
            return(JSON.stringify({status: 406, error: `Memory must be between 4 and 1024 MB`}));
        }

        // Process statement
        statement = task.legend;
        input_statement = task.input || "";
        output_statement = task.output || "";
        note = task.notes || "";
    
        if(!statement) {
            return(JSON.stringify({status: 404, error: `There are not statement`}));
        }

        // Process test cases
        test = [];

        fs.readdirSync(`${main_path}/tests`).forEach((file) => {
            if(file.split(".")[1] == "a"){
                if (!fs.existsSync(`${main_path}/tests/${file.split(".")[0]}`)) {
                    return(JSON.stringify({status: 404, error: `There are answer ${file}, but no test ${file.split(".")[0]}`}));
                }
    
                const input = fs.readFileSync(`${main_path}/tests/${file.split(".")[0]}`, "utf-8");
                const output = fs.readFileSync(`${main_path}/tests/${file}`, "utf-8");
    
                test.push({test_id: test.length + 1, input: input, output: output, status: "Closed" });
            }
        });

        is_checker = 0;
        checker_code = '';
        checker_language = '';

        return(JSON.stringify({name, time_limit, memory_limit, statement, input_statement, output_statement, note, test, is_checker, checker_code, checker_language}));
    }
    catch(e){
        console.error(e)
        return({error: e})
    }
    
}