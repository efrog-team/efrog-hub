const fs = require('fs');
const fse = require('fs-extra');
const AdmZip = require('adm-zip');
const xml2js = require('xml2js');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Чтение данных из stdin
rl.on('line', async (input) => {
    try {
        // Ваш код обработки данных
        const data = JSON.parse(input);
        const res = await processFile(data.base64String, data.currentSession, data.currentDirectory, data.fileName, data.taskName);

        if (typeof res === 'string') {
            console.log(res);
        } else {
            console.error(res.error);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        rl.close();
    }
});

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

async function processFile(base64String, curent_sesion, main_dir, fileName, taskName) {
    try{
        let name, time_limit, memory_limit, statement, input_statement, output_statement, note;
        let test = [];

        if (fs.existsSync(`./files/upload/ejudge_${curent_sesion}`)) {
            fse.removeSync(`./files/upload/ejudge_${curent_sesion}`);
        }
        fs.mkdirSync(`./files/upload/ejudge_${curent_sesion}`);

        let targetFilePath = `${main_dir}/files/upload/ejudge_${curent_sesion}/${fileName}`;

        const fileBuffer = Buffer.from(base64String, 'base64');
        fs.writeFileSync(targetFilePath, fileBuffer);
        
        let zip = new AdmZip(targetFilePath);
        zip.extractAllTo(`${main_dir}/files/upload/ejudge_${curent_sesion}/`);
        fs.unlinkSync(targetFilePath);
        
        let main_path = `${main_dir}/files/upload/ejudge_${curent_sesion}/`;
        const contests =  fs.readdirSync(main_path);
        main_path = `${main_path}${contests[0]}/`;


        //Check folder with task about nesessary folders and files
        const directories = ['statements', 'tests', `statements/${taskName}.xml`];

        for(let i = 0; i < directories.length; i++) {
            if (!fs.existsSync(main_path + directories[i])) {
                return(JSON.stringify({status: 404, error: `There are not ${directories[i]}`}));
            }
        }
    
        // Process general info
        const readFilePromise = new Promise((resolve, reject) => {
            fs.readFile(`${main_path}statements/${taskName}.xml`, "utf-8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        const data = await readFilePromise;

        const result = await new Promise((resolve, reject) => {
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        name = result.problem.statement[0].title[0];
        time_limit = 5;
        memory_limit = 256;

    

        // Process statement
        statement = processObject(result.problem.statement[0].description[0]);
        input_statement = processObject(result.problem.statement[0].input_format[0]);
        output_statement = processObject(result.problem.statement[0].output_format[0]);
        note = processObject(result.problem.statement[0].notes[0]);

        // Process test cases
        test = [];
        const examples = result.problem.examples[0].example;

        for (let i = 0; i < examples.length; i++) {
            test.push({
                test_id: test.length + 1,
                input: examples[i].input[0],
                output: examples[i].output[0],
                status: "Opened"
            });
        }

        const userTests = fs.readdirSync(`${main_path}tests/${taskName}`);

        for (let i = 0; i < userTests.length; i++) {
            if (userTests[i].split(".")[1] == "answ") {
                const output_format = fs.readFileSync(`${main_path}tests/${taskName}/${userTests[i]}`, 'utf-8');

                const input_format_file = `${userTests[i].split(".")[0]}.dat`;
                const input_format_path = `${main_path}tests/${taskName}/${input_format_file}`;

                if (!fs.existsSync(input_format_path)) {
                    return(JSON.stringify({status: 404, error: `There is ${userTests[i]}, but no ${input_format_file}`}));
                }

                const input_format = fs.readFileSync(input_format_path, 'utf-8');
                test.push({ test_id: test.length + 1, input: input_format, output: output_format, status: "Closed" });
            }
        }
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