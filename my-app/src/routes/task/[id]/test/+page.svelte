<script>
    export let data;
    let id = data.task_id;
    let test = data.query;
    let test_amount = test.length;

    async function save () {
        const res = await fetch('/api/task/test',{
        method: 'POST',
        body: JSON.stringify({test, id})
        });

        const answ = await res.json();
        console.log(answ)
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
        console.log(test);
    }
</script>



<svelte:head>
    <title>Create task</title>
</svelte:head>

<main>
    <div style="padding: 2vw;">
        <p>Кількість тестів</p>
        <input type="text" id="tests_amount" style="display: inline; float:left; margin-right: 3vw; " bind:value={test_amount}>
        <button on:click={create_test} class="submit_button" style="margin-top: 7px; margin-right: 0; float:right;">Створити тести</button>

        <table>
            <tr>
                <th>№</th>
                <th>Вхідні дані</th>
                <th>Вихідні дані</th>
                <th>Статус тесту</th>
            </tr>
            {#each test as test}
                <tr>
                    <td>{test.test_id}</td>
                    <td><textarea name="input_value" id="input_value" class="test_area"  bind:value={test.input}></textarea></td>
                    <td><textarea name="outnput_value" id="outnput_value"  class="test_area" bind:value={test.output}></textarea></td>
                    <td>
                        <select class="select" bind:value={test.status}>
                            <option value="Opened">Opened</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </td>
                </tr>
            {/each}
        </table>
        <button on:click={save}>Зберегти зміни</button>

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
        width: 45vw;
        height: 56px;
        margin-top: 7px;
        margin-bottom: 44px;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        display:flex;
    }
    .test_area{
        outline: none;
        border: none;
        background-color: #333333;
        width: 25vw;
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
        width: 25vw;
        height: 60px;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        resize: none;
        display:flex;
        margin: auto;
    }

    .submit_button{
        width: 45vw;
        float: right;
    }
    button{
        width: 96vw;
        height: 60px;
        background-color: #28743b;
        border: 4px solid #28743b;
        margin-top: 15px;
        display:inline;
        float: left;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        text-align: center;
        text-decoration: none;
    }
    table{
        width: 96vw;
        background-color: #28743b;
        margin-top: 15px;
        font-size: 18px;
        color: white;
        font-family: "e-Ukraine";
        text-align: center;
    }
    th{
        background-color: #252526;
        height: 35px;
    }
    td{
        background-color: #333333;
        height: 30px;
    }
</style>