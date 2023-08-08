<script>
    export let data;
    let id = data.task_id;
    let test = data.query;
    let test_amount = 1;

    async function save () {
        const res = await fetch('/api/task1/test',{
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
            <p class="number">{test.test_id}</p>
            <textarea name="input_value" id="input_value" class="test_area"  bind:value={test.input}></textarea>
            <textarea name="outnput_value" id="outnput_value"  class="test_area" bind:value={test.output}></textarea>
            <select class="select" bind:value={test.status}>
                <option value="Opened">Opened</option>
                <option value="Closed">Closed</option>
            </select>
            </div>
        {/each}
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
        width: 95vw;
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
button{
        width: 95vw;
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
</style>