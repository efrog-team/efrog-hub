<script>
    export let data;
    let id = data.task_id;
    let statement = data.query[0].statement;
    let input_statement = data.query[0].input_statement;
    let output_statement = data.query[0].output_statement;
    let note = data.query[0].note;


    async function save () {
        if(statement == data.query[0].statement && input_statement == data.query[0].input_statement && output_statement == data.query[0].output_statement && note == data.query[0].note){
            alert("Дані не змінилися")
            return 1;
        }
        const res = await fetch('/api/task/statement',{
        method: 'POST',
        body: JSON.stringify({statement, input_statement, output_statement, note, id})
        });

        const answ = await res.json();
        console.log(answ)
    }
</script>



<svelte:head>
    <title>Create task</title>
</svelte:head>

<main>
    <div style="padding: 2vw;">
        <p>Умова</p>
        <textarea name="statement" id="statement" class="statement" bind:value={statement}></textarea>
        <p>Умова до вхідних даних</p>
        <textarea name="input_statement" id="input_statement" class="statement" bind:value={input_statement}></textarea>
        <p>Умова до вихідних даних</p>
        <textarea name="outnput_statement" id="outnput_statement" class="statement" bind:value={output_statement}></textarea>
        <p>Примітки</p>
        <textarea name="notes" id="notes" class="statement" bind:value={note}></textarea>
        <button on:click={save}>Зберегти зміни</button>
    </div>
</main>

<style>
    p{
        color:white;
        font-family: "e-Ukraine";
        font-size: 22px;
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