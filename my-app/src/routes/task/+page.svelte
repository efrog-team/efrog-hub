<script>
    let task_name = "";
    let time_limit = "";
    let memory_limit = "";
    let statement = "";
    let input_statement = "";
    let output_statement = "";
    let note = "";
    let test = [];
    let test_amount = 1;
    let url;


    async function create_file () {
        const response = await fetch('/api/task', {
            method: 'POST',
            body: JSON.stringify({task_name, time_limit, memory_limit, statement, input_statement, output_statement, note, test}),
        });

        url = await response.json();
        console.log(url);

        let anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = task_name;
        anchor.style = "display: none";
        anchor.click();
        anchor.remove();


        const answer = await fetch('/api/task', {
            method: 'GET'
        });
        let db = await answer.json();
        console.log(db);

    }

    async function handleFileInput(event) {
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file);

        try {
        const response = await fetch('/api/create-task', {
            method: 'POST',
            body: formData,
        });

        const answer = await response.json();
        if (typeof answer == "string"){
            alert (answer);
        }
        else {
            console.log(answer);
            task_name = answer.name;
            time_limit = answer.time_limit;
            memory_limit = answer.memory_limit;
            statement =  answer.statement;
            input_statement = answer.input_statement;
            output_statement = answer.output_statement;
            note = answer.note;
            test = answer.tests;
        }


        } catch (error) {
        alert('Произошла ошибка при отправке файла на сервер.');
        console.error(error);
        }
  }

    function create_test() {
        if (test_amount < test.length) {
            test.length = test_amount;
        }
        else {
            for(let i = test.length; i < test_amount; i++){
            test.push({id: i + 1, input: "", output: "", status: "Closed"});
        }
        test = test;
        }
        console.log(test);
    }
</script>


<svelte:head>
    <title>Create task</title>
</svelte:head>

<main>
    <div class="content">
        <div style="padding: 2vw;">

            <p class="acent-text"><b>Загальна інформація</b></p>
            <p>Назва</p>
            <input type="text" id="task_name" bind:value={task_name}>
            <p>Час виконання</p>
            <input type="text" id="time_limit" bind:value={time_limit}>
            <p>Обсяг пам'яті</p>
            <input type="text" id="memory_limit" bind:value={memory_limit}>
            <br>

            <p class="acent-text"><b>Формування умови</b></p>
            <p>Умова</p>
            <textarea name="statement" id="statement" class="statement" bind:value={statement}></textarea>
            <p>Умова до вхідних даних</p>
            <textarea name="input_statement" id="input_statement" class="statement" bind:value={input_statement}></textarea>
            <p>Умова до вихідних даних</p>
            <textarea name="outnput_statement" id="outnput_statement" class="statement" bind:value={output_statement}></textarea>
            <p>Примітки</p>
            <textarea name="notes" id="notes" class="statement" bind:value={note}></textarea>
            <br>

            <p class="acent-text"><b>Тести</b></p>
            <p>Кількість тестів</p>
            <input type="text" id="tests_amount" style="display: inline; float:left; margin-right: 3vw; width: 44vw" bind:value={test_amount}>
            <button on:click={create_test} class="submit_button" style="margin-top: 7px; margin-right: 0; float:right;">Створити тести</button>


            <div class="test_header">
                <p class="test_font">№</p>
                <p class="test_font">Вхідні дані</p>
                <p class="test_font">Вихідні дані</p>
                <p class="test_font">Статус тесту</p>
            </div>
            {#each test as test}
            <div class="test">
                <p class="number">{test.id}</p>
                <textarea name="input_value" id="input_value" class="test_area"  bind:value={test.input}></textarea>
                <textarea name="outnput_value" id="outnput_value"  class="test_area" bind:value={test.output}></textarea>
                <select class="select" bind:value={test.status}>
                    <option value="Opened">Opened</option>
                    <option value="Closed">Closed</option>
                </select>
                </div>
            {/each}

            <button on:click={create_file} class="submit_button">Створити задачу</button>

            <input type="file" style="display: none;" name ="upload_file" on:change={handleFileInput}>
            <button on:click={() => document.querySelector("input[name=upload_file]").click()} class="submit_button" style="padding-bottom: 0; margin-right: 0; margin-bottom:0; float:right">Завантажити файл</button>
            

        </div>
        
</main>

<style>
    p{
        color:white;
        font-family: "e-Ukraine";
        font-size: 22px;
    }
    input{
        outline: none;
        border: none;
        background-color: #333333;
        border-bottom: 4px solid #28743b;
        width: 95vw;
        height: 56px;
        margin-top: 7px;
        margin-bottom: 44px;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        display:flex;
    }
    .statement{
        outline: none;
        border: none;
        background-color: #333333;
        border-bottom: 4px solid #28743b;
        width: 95vw;
        height: 100px;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        resize: none;
        display:flex;
    }
    .test_area{
        outline: none;
        border: none;
        background-color: #252526;
        width: 25vw;
        height: 60px;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        resize: none;
        display:flex;
        margin: auto;
    }
    select{
        outline: none;
        border: none;
        background-color: #252526;
        width: 25vw;
        height: 60px;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        resize: none;
        display:flex;
        margin: auto;
    }
    .test_header{
        width: 95vw;
        height: 70px;
        background-color: #333333;
        border: 4px solid #28743b;
        display:flex;
        margin-top: 15px;
        color: white;
        font-family: "e-Ukraine";
        text-align: justify;
    }
    .test_font{
        margin: auto;
    }
    .test{
        width: 95vw;
        height: 70px;
        background-color: #252526;
        border-bottom: 4px solid #28743b;
        display:flex;
        margin-top: 15px;
        color: white;
        font-family: "e-Ukraine";
    }
    .number{
        margin: auto;
        margin-left: 6%;
        margin-right: 10%;
        margin-bottom: 30px;
        text-align: center;
    }
    .submit_button{
        width: 44vw;
        height: 60px;
        background-color: #28743b;
        border: 4px solid #28743b;
        margin-right: 4vw;
        margin-top: 15px;
        display:inline;
        float: left;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        text-align: center;
        text-decoration: none;
    }
    .acent-text{
        color:#28743b
    }
</style>
