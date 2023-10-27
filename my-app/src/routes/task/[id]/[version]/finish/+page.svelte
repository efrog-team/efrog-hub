<script>
    import  {message} from '$lib/message.js'
    export let data;
    let task_id = data.task_id;
    let version = data.version.length - 1;
    let name_cms, name_ejudge, language_polygon;
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

        if(!name_ejudge){
                message("Ведіть назву задачі", false);
                return;
            }
        formData.append('taskName', name_ejudge);

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

        let error = await response.text();
        error = JSON.parse(error).error;
        message(error, false);
        return;
      }

      async function upload_file_ejudge_alternative(event) {
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file);

        if(!name_ejudge){
                message("Ведіть назву задачі", false);
                return;
            }
        formData.append('taskName', name_ejudge);

        const response = await fetch('/api/task/finish/upload-file-ejudge-alternative', {
            method: 'POST',
            body: formData,
        });
        if(response.ok){
          const task = await response.json();
          message("Задача успішно завантажена", true);
          localStorage.setItem(task_id, JSON.stringify(task))
          return;
        }

        let error = await response.text();
        error = JSON.parse(error).error;
        message(error, false);
        return;
        }

        async function upload_file_cms(event) {
            const file = event.target.files[0];
            console.log(file)
            const formData = new FormData();
            formData.append('file', file);

            if(!name_cms){
                message("Ведіть назву задачі", false);
                return;
            }
            formData.append('taskName', name_cms);
            console.log(formData)
            const response = await fetch('/api/task/finish/upload-file-cms', {
                method: 'POST',
                body: formData,
            });
            if(response.ok){
                const task = await response.json();
                message("Задача успішно завантажена", true);
                localStorage.setItem(task_id, JSON.stringify(task))
                return;
            }
            let error = await response.text();
            error = JSON.parse(error).error;
            message(error, false);
            return;
        }

        async function upload_file_polygon(event) {
            const file = event.target.files[0];

            const formData = new FormData();
            formData.append('file', file);

            if(!language_polygon){
                message("Ведіть мову задачі", false);
                return;
            }
            console.log(language_polygon)
            formData.append('language', language_polygon);
            const response = await fetch('/api/task/finish/upload-file-polygon', {
                method: 'POST',
                body: formData,
            });
            if(response.ok){
                const task = await response.json();
                message("Задача успішно завантажена", true);
                localStorage.setItem(task_id, JSON.stringify(task))
                return;
            }
            let error = await response.text();
            error = JSON.parse(error).error;
            message(error, false);
            return;
        }
</script>

<style>
  .input{
        color: white;
        font-size: 16px;
        font-family: "e-Ukraine";
        outline: none;
        border: none;
        background-color: #333333;
        border-radius: 5px;
        width: 100%;
        height: 58px;
        margin-top: 15px;
        margin-right: 4vw;
    
   }
    .submit_button{
        outline: none;
        border: none;
        width: 100%;
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
    p{
       color:white;
       font-family: "e-Ukraine";
       font-size: 22px;
   }
    input::-webkit-input-placeholder {
        text-align: center;
    }
</style>

<svelte:head>
    <title>Create task</title>
</svelte:head>
 
<main class="col-md-12 col-lg-9">
    <div style="row">
        <p>Efrog</p>
        <diw class="row">
            <div class="col-md-12 col-lg-6">
                <button on:click={create_file} class="submit_button">Завантажити файл</button>
            </div>
            <div class="col-12 col-lg-6">
                <input type="file" style="display: none;" name ="upload_file" on:change={upload_file}>
                <button on:click={() => document.querySelector("input[name=upload_file]").click()} class="submit_button">Підвантажити файл</button>
            </div>
        </diw>
        
        
        <br>
        <p>Ejudge</p>

        <div class="row">
            <div class="col-12">
                <input type="text" class="input" bind:value={name_ejudge}  placeholder="Назва задачі, яку ви бажаєте імпортувати з архіву контесту">
            </div>       
        </div>

        <div class="row">
            <div class="col-md-12 col-lg-6">
                <input type="file" style="display: none;" name ="upload_file_ejudge" on:change={upload_file_ejudge}>
                <button on:click={() => document.querySelector("input[name=upload_file_ejudge]").click()} class="submit_button">Стандартна</button>
            </div>
            <div class="col-12 col-lg-6">
                <input type="file" style="display: none;" name ="upload_file_ejudge_alternative" on:change={upload_file_ejudge_alternative}>
                <button on:click={() => document.querySelector("input[name=upload_file_ejudge_alternative]").click()} class="submit_button" >Альтернативна</button>
            </div>
        </div>

        <br>
        <p>CMS</p>

        <diw class="row">
            <div class="col-md-12 col-lg-6">
                <input type="text" class="input" bind:value={name_cms} placeholder="Ведіть назву задачі">
            </div>
            <div class="col-12 col-lg-6">
                <input type="file" style="display: none;" name ="upload_file_cms" on:change={upload_file_cms}>
                <button on:click={() => document.querySelector("input[name=upload_file_cms]").click()} class="submit_button" >Підвантажити файл</button>
            </div>
        </diw>


        <br>
        <p>Polygon</p>

        <diw class="row">
            <div class="col-md-12 col-lg-6">
                <input type="text" class="input" bind:value={language_polygon} placeholder="Ведіть  мову задачі">
            </div>
            <div class="col-12 col-lg-6">
                <input type="file" style="display: none;" name ="upload_file_polygon" on:change={upload_file_polygon}>
                <button on:click={() => document.querySelector("input[name=upload_file_polygon]").click()} class="submit_button" >Підвантажити файл</button>
            </div>
        </diw>
        
    </div>
</main>