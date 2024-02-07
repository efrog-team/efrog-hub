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

        if (fs.existsSync(`./files/upload/ejudge_a${curent_sesion}`)) {
            fse.removeSync(`./files/upload/ejudge_a${curent_sesion}`);
        }
        fs.mkdirSync(`./files/upload/ejudge_a${curent_sesion}`);

        let targetFilePath = `${main_dir}/files/upload/ejudge_a${curent_sesion}/${fileName}`;

        const fileBuffer = Buffer.from(base64String, 'base64');
        fs.writeFileSync(targetFilePath, fileBuffer);
        
        let zip = new AdmZip(targetFilePath);
        zip.extractAllTo(`${main_dir}/files/upload/ejudge_a${curent_sesion}/`);
        fs.unlinkSync(targetFilePath);
        
        let main_path = `${main_dir}/files/upload/ejudge_a${curent_sesion}/`;
        const contests =  fs.readdirSync(main_path);
        main_path = `${main_path}${contests[0]}/`;

        const directories = [taskName, `${taskName}/tests`, `${taskName}/statement.xml`];

        for(let i = 0; i < directories.length; i++) {
            if (!fs.existsSync(main_path + directories[i])) {
                return(JSON.stringify({status: 404, error: `There are not ${directories[i]}`}));
            }
        }
    
      
        // Записуємо дані з файлу statement.xml
        const readFilePromise = new Promise((resolve, reject) => {
            fs.readFile(main_path + "/" + taskName + "/" + "statement.xml", "utf-8", (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        
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

        const examples = result.problem.examples[0].example;

        for(let i = 0; i < examples.length; i++){
            test.push({test_id: test.length + 1, input: examples[i].input[0], output: examples[i].output[0], status: "Opened"});
        }

        const userTests = fs.readdirSync(main_path  + taskName + "/" + 'tests' );
        
        for(let i = 0; i < userTests.length; i ++){

            if(userTests[i].split(".")[1] == "answ"){
                const ouput_format = fs.readFileSync(main_path + taskName + "/" + 'tests' + "/"  + userTests[i], 'utf-8');

                if (!fs.existsSync(main_path + taskName + "/" + 'tests' + "/" + userTests[i].split(".")[0] + ".dat")){
                    clear_dir (main_path);
                    return(JSON.stringify({status: 404, error: `There is ${userTests[i]}, but no ${userTests[i].split(".")[0] + ".dat"}`}));
                }

                const input_format = fs.readFileSync(main_path + taskName + "/" + 'tests' + "/" + userTests[i].split(".")[0] + ".dat", 'utf-8');

                test.push({ test_id: test.length + 1, input: input_format, output: ouput_format, status: "Closed" });
            }


        }
        return(JSON.stringify({name, time_limit, memory_limit, statement, input_statement, output_statement, note, test}));
    } catch(e){
        console.error(e)
        return({error: e})
    }   
}