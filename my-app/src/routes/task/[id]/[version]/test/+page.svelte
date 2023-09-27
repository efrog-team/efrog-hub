<script>
    import  {message} from '$lib/message.js'
    import { onMount } from 'svelte';
    export let data;
    let id, test, test_amount, task;
    onMount(() => {
        id = data.task_id;
        test = data.test
        test_amount = test.length;
        if (localStorage.getItem(id) == null){
            localStorage.setItem(id, JSON.stringify({...data.task, test: data.test}));
            task = JSON.parse(localStorage.getItem(id));
        }
        else {
            task = JSON.parse(localStorage.getItem(id));
            if (test != task.test){
                test = task.test.slice(0);
                test_amount = test.length;
            }
        }

        const textareas = document.querySelectorAll('.test_area');
        textareas.forEach(textarea => {
            resize({ target: textarea });
        });
    });

    function resize(_e) {
        const element = _e.target || _e.srcElement;
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
    }

    async function save () {
        if(test == task.test){
            message("Дані не змінилися", false);
            return 1;
        }

        task.test = test;
        localStorage.setItem(id, JSON.stringify(task));

        message("Зміни збережені", true);
    }

    function create_test() {
        if (test_amount < test.length) {
            test.length = test_amount;
        }
        else {
            for(let i = test.length; i < test_amount; i++){
            test.push({test_id: i + 1, input: "", output: "", status: "Closed"});
        }
        test = test;
        }
    }
</script>



<svelte:head>
    <title>Create task</title>
</svelte:head>

<main style="display: inline-block; margin-left: 1vw;">
    <div style="display: inline-block">
        <p>Кількість тестів</p>
        <input type="text" id="tests_amount" style="margin-left: 0; " bind:value={test_amount}>
        <button on:click={create_test} class="submit_button" style="margin-top: 7px; margin-right: 0;">Створити тести</button>
    </div>

 

        <table>
            <tr>
                <th>№</th>
                <th>Вхідні дані</th>
                <th>Вихідні дані</th>
                <th>Статус тесту</th>
            </tr>
            {#if test}
                {#each test as test}
                    <tr>
                        <td>{test.test_id}</td>
                        <td><textarea name="input_value" id="input_value" class="test_area"  bind:value={test.input} on:input={resize}></textarea></td>
                        <td><textarea name="outnput_value" id="outnput_value"  class="test_area" bind:value={test.output} on:input={resize}></textarea></td>
                        <td>
                            <select class="select" bind:value={test.status}>
                                <option value="Opened">Opened</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </td>
                    </tr>
                {/each}
            {/if}

        </table>
        <button on:click={save}>Зберегти зміни</button>
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
        border-radius: 5px;
        width: 35vw;
        height: 56px;
        margin-top: 7px;
        margin-bottom: 10px;
        margin-right: 2vw;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";

    }
    .test_area{
        outline: none;
        border: none;
        background-color: #333333;
        width: 15vw;
        height: 30px;
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
        background-color: #333333;
        width: 15vw;
        height: 60px;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        resize: none;
        display:flex;
        margin: auto;
    }

    .submit_button{
        width: 35vw;
        display: inline-block;
    }
    button{
        outline: none;
        border: none;
        width: 72.5vw;
        height: 60px;
        background-color: #28743b;
        border-radius: 5px;
        margin-top: 15px;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        text-align: center;
        text-decoration: none;
    }
    table{
        width: 72.5vw;
        background-color: #28743b;
        margin-top: 15px;
        font-size: 18px;
        color: white;
        font-family: "e-Ukraine";
        text-align: center;
        border-radius: 5px;
    }
    th{
        background-color: #252526;
        height: 35px;
        border-radius: 5px;
    }
    td{
        background-color: #333333;
        height: 30px;
        border-radius: 5px;
    }
</style>