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

    const res = processFile(data.base64String, data.curent_sesion, data.currentDirectory, data.fileName);
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

function processFile(base64String, curent_sesion, main_dir, fileName) {
    try{
        let name, time_limit, memory_limit, statement, input_statement, output_statement, note;
        let test = [];

        if (fs.existsSync(`./files/upload/efrog_${curent_sesion}`)) {
            fse.removeSync(`./files/upload/efrog_${curent_sesion}`);
        }
        fs.mkdirSync(`./files/upload/efrog_${curent_sesion}`);

        let targetFilePath = `${main_dir}/files/upload/efrog_${curent_sesion}/${fileName}`;

        const fileBuffer = Buffer.from(base64String, 'base64');
        fs.writeFileSync(targetFilePath, fileBuffer);
        
        let zip = new AdmZip(targetFilePath);
        zip.extractAllTo(`${main_dir}/files/upload/efrog_${curent_sesion}/`);
        fs.unlinkSync(targetFilePath);
        
        let main_path = `${main_dir}/files/upload/efrog_${curent_sesion}/`;
        
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
        
        for (let i = 0; i < directories.length; i++) {
            if (!fs.existsSync(main_path + directories[i])) {
                fse.removeSync(main_path);
                return(JSON.stringify({status: 404, error: `There are not ${directories[i]}`}));
            }
        }
        
        // Process general info
        name = fs.readFileSync(main_path + 'general_info/name.txt', 'utf-8');
        time_limit = fs.readFileSync(main_path + 'general_info/time_limit.txt' , 'utf-8');
        memory_limit = fs.readFileSync(main_path + 'general_info/memory_limit.txt', 'utf-8');
            
        if(!checkValue(time_limit, 1, 10)){
            return(JSON.stringify({status: 406, error: `Time must be between 1 and 10 seconds`}));
        }
        if(!checkValue(memory_limit, 4, 1024)){
            return(JSON.stringify({status: 406, error: `Memory must be between 4 and 1024 MB`}));
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
                    return(JSON.stringify({status: 404, error: `Test${currentFile} exists in ${testCase.inputPath}, but does not exist in ${testCase.outputPath}`}));
                }
            }
        }
        return(JSON.stringify({name, time_limit, memory_limit, statement, input_statement, output_statement, note, test}));
    }
    catch(e){
        console.error(e)
        return({error: e})
    }
    
}