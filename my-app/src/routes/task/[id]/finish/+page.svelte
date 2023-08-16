<script>
    import  {message} from '$lib/message.js'
    export let data;
    let task_id = data.task_id;
    async function create_file () {
        const response = await fetch('/api/task/finish/create-file', {
            method: 'POST',
            body: JSON.stringify({task_id}),
        });

        const url = await response.json();

        let anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = task_id;
        anchor.style = "display: none";
        anchor.click();
        anchor.remove();


        await fetch('/api/task/finish/create-file', {
            method: 'PUT'
        });

    }

    async function upload_file(event) {
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file);
        formData.append('task_id', task_id)
        const response = await fetch('/api/task/finish/upload-file', {
            method: 'POST',
            body: formData,
        });

        const answ = await response.json();
        if (answ == "Задача успішно завантажена"){
            message(answ, true);
            return;
        }
        message(answ, false);
  }
</script>

<style>
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
</style>

<svelte:head>
    <title>Create task</title>
</svelte:head>

<main>
    <div style="padding: 2vw;">
        <button on:click={create_file} class="submit_button">Завантажити файл</button>
        <input type="file" style="display: none;" name ="upload_file" on:change={upload_file}>
        <button on:click={() => document.querySelector("input[name=upload_file]").click()} class="submit_button" style="padding-bottom: 0; margin-right: 0; margin-bottom:0; float:right">Підвантажити файл</button>
    </div>
</main>