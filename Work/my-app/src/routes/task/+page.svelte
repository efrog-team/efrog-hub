<script>
    let task_name = "";
    let time_limit = "";
    let memory_limit = "";
    let statement = "";
    let input_statement = "";
    let output_statement = "";
    let note = "";
    let test = [{id: 1, input: "", output: "", status: "Closed"}];
    let test_amount = 1;
    let url;


    async function create_file () {
        const response = await fetch('/api/task', {
            method: 'POST',
            body: JSON.stringify({task_name, time_limit, memory_limit, statement, input_statement, output_statement, note, test}),
        });

        url = await response.json();
        console.log(url);

        let anchor = document.createElement('a')
        anchor.href = url
        anchor.download = task_name
        anchor.style = "display: none"
        anchor.click()
        anchor.remove()

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

<style>
    p{
        color:white;
        font-family: "e-Ukraine";
        font-size: 22px;
    }
    input{
        outline: none;
        border: none;
        background-color: rgb(57, 61, 69);
        border-bottom: 4px solid rgb(33, 121, 45);
        width: 44vw;
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
        background-color: rgb(57, 61, 69);
        border-bottom: 4px solid rgb(33, 121, 45);
        width: 53vw;
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
        background-color: rgb(41, 44, 51);
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
        background-color: rgb(41, 44, 51);
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
        background-color: rgb(57, 61, 69);
        border: 4px solid rgb(33, 121, 45);
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
        background-color: rgb(41, 44, 51);
        border-bottom: 4px solid rgb(33, 121, 45);
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
        background-color: rgb(33, 121, 45);
        border: 4px solid rgb(33, 121, 45);
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
</style>

<svelte:head>
    <title>Create task</title>
</svelte:head>

<main>
    <div class="content">
        <div id="header" class="header">
            <div style="display: inline; float:left; margin-top: 6px; margin-left: 15px;"><a href="\main"><img src="logo.png" class="menu_photo" alt=" "></a></div>
            <div style="display: inline; float:right; margin-top: 6px;"><a href="\for-user"><img src="favicon.png" class="menu_photo" alt=" "></a></div>
            <div style="display: inline; float:right; margin-top: 30px;">   
                <a href="\finding-task" class="menu_text">Задачі</a>
                <a href="\olimpiad" class="menu_text">Олімпіади</a>
            </div>
        </div>
        <div style="padding: 2vw;">
            <p>Назва</p>
            <input type="text" id="task_name" bind:value={task_name}>
            <p>Час виконання</p>
            <input type="text" id="time_limit" bind:value={time_limit}>
            <p>Обсяг пам'яті</p>
            <input type="text" id="memory_limit" bind:value={memory_limit}>
            <p>Умова</p>
            <textarea name="statement" id="statement" class="statement" bind:value={statement}></textarea>
            <p>Умова до вхідних даних</p>
            <textarea name="input_statement" id="input_statement" class="statement" bind:value={input_statement}></textarea>
            <p>Умова до вихідних даних</p>
            <textarea name="outnput_statement" id="outnput_statement" class="statement" bind:value={output_statement}></textarea>
            <p>Примітки</p>
            <textarea name="notes" id="notes" class="statement" bind:value={note}></textarea>
            <p>Кількість тестів</p>

            <input type="text" id="tests_amount" style="display: inline; float:left; margin-right: 3vw" bind:value={test_amount}>
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
            <button class="submit_button" style="padding-bottom: 0; margin-right: 0; margin-bottom:0; float:right"><a href= {url} download style="color: white; text-decoration:none;">Завантажити файл</a></button>
            

        </div>
        
</main>