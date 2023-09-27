<script>
    import  {message} from '$lib/message.js'
    export let data;
    let task_id = data.task_id;
    let version = data.version.length - 1
    async function create_file () {
        const response = await fetch('/api/task/finish/create-file', {
            method: 'POST',
            body: JSON.stringify({task_id, version}),
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

        const task = await response.json();

        if (typeof task === "string"){
            message(task, false);
            return;
        }
        message("Задача успішно завантажена", true);
        localStorage.setItem(task_id, JSON.stringify(task));
  }


  async function upload_file_ejudge(event) {
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/task/finish/upload-file-ejudge', {
            method: 'POST',
            body: formData,
        });
        if(response.ok){
          const task = await response.json();
          message("Задача успішно завантажена", true);
          localStorage.setItem(task_id, JSON.stringify(task))
          return;
        }

        console.log(response)

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
        outline: none;
        border: none;
        width: 20vw;
        height: 60px;
        background-color: #28743b;
        border-radius: 5px;
        margin-top: 15px;
        display:inline-block;
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

<main style="display: inline-block; margin-left: 2vw; max-width: max-content">
    <div style="display: inline-block">
        <button on:click={create_file} class="submit_button" style="margin-right: 4vw">Завантажити файл</button>
        <input type="file" style="display: none;" name ="upload_file" on:change={upload_file}>
        <button on:click={() => document.querySelector("input[name=upload_file]").click()} class="submit_button" style="margin-right: 4vw">Підвантажити файл</button>

        <input type="file" style="display: none;" name ="upload_file_ejudge" on:change={upload_file_ejudge}>
        <button on:click={() => document.querySelector("input[name=upload_file_ejudge]").click()} class="submit_button" >Підвантажити файл ejudge</button>
    </div>

   
</main>