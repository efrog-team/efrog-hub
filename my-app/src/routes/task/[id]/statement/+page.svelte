<script>
    import { onMount } from 'svelte';

    export let data;
    let id = data.task_id;
    let statement = data.task.statement;
    let input_statement = data.task.input_statement;
    let output_statement = data.task.output_statement;
    let note = data.task.note;
    let textareaRefs = [];

    async function save () {
        if(statement == data.task.statement && input_statement == data.task.input_statement && output_statement == data.task.output_statement && note == data.task.note){
            alert("Дані не змінилися")
            return 1;
        }
        const res = await fetch('/api/task/statement',{
        method: 'POST',
        body: JSON.stringify({statement, input_statement, output_statement, note, id})
        });

        const answ = await res.json();
        alert(answ)
    }
    function resize(event) {
        const getElement = event.target;
        getElement.style.height = "auto";
        getElement.style.height = Math.max(getElement.scrollHeight, getElement.offsetHeight) + "px";
    }

    onMount(() => {
        textareaRefs.forEach(textarea => {
            resize({ target: textarea });
        });
    });
</script>

<svelte:head>
    <title>Create task</title>
</svelte:head>

<main>
    <div style="padding: 2vw;">
        <p>Умова</p>
        <textarea name="statement" id="statement"  bind:value={statement} bind:this={textareaRefs[0]} on:input={resize}></textarea>
        <p>Умова до вхідних даних</p>
        <textarea name="input_statement" id="input_statement"  bind:value={input_statement} bind:this={textareaRefs[1]} on:input={resize}></textarea>
        <p>Умова до вихідних даних</p>
        <textarea name="output_statement" id="output_statement"  bind:value={output_statement} bind:this={textareaRefs[2]} on:input={resize}></textarea>
        <p>Примітки</p>
        <textarea name="note" id="note"  bind:value={note} bind:this={textareaRefs[3]} on:input={resize}></textarea>
        <button on:click={save}>Зберегти зміни</button>
    </div>
</main>

<style>
    p{
        color:white;
        font-family: "e-Ukraine";
        font-size: 22px;
    }
    textarea{
        outline: none;
        border: none;
        background-color: #333333;
        border-bottom: 4px solid #28743b;
        width: 95vw;
        height: 100px;
        color: white;
        font-size: 18px;
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