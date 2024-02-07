<script>
    import { onMount } from 'svelte';
    import {message} from '$lib/message.js'
    export let data;
    let id, name, time_limit, memory_limit,  task, checker_code, is_checker, checker_language;

    onMount(() => {
        id = data.task_id;
        name = data.task.name;
        time_limit = data.task.time_limit;
        memory_limit = data.task.memory_limit;

        is_checker = data.task.is_checker === 1 ? true : false;;
        checker_code = data.task.checker_code;
        checker_language = data.task.checker_language;


        if (localStorage.getItem(id) == null){
            localStorage.setItem(id, JSON.stringify({...data.task, test: data.test}));
            task = JSON.parse(localStorage.getItem(id));
        }
        else {
            task = JSON.parse(localStorage.getItem(id));
            if (name != task.name){
                name = task.name;
            }
            if (time_limit != task.time_limit){
                time_limit = task.time_limit;
            }
            if (memory_limit != task.memory_limit){
                memory_limit = task.memory_limit;
            }
            if (is_checker != task.is_checker){
                is_checker = task.is_checker === 1 ? true : false;
            }
            if (checker_code != task.checker_code){
                checker_code = task.checker_code;
            }
            if (checker_language != task.checker_language){
                checker_language = task.checker_language;
            }
        }
    });


    async function save () {
        if(!check(time_limit, 1, 10)){
            message("Час має бути між 1 да 10 секундами", false);
            return;
        }
        if(!check(memory_limit, 4, 1024)){
            message("Пам'ять має бути між 4 да 1024 МБ", false);
            return;
        }
        if(name == task.name && time_limit == task.time_limit && memory_limit == task.memory_limit && is_checker == task.is_checker && checker_code == task.checker_code && checker_language == task.checker_language){
            message("Дані не змінилися", false);
            return 1;
        }
        task.name = name;
        task.time_limit = time_limit;
        task.memory_limit = memory_limit;
        task.is_checker = is_checker === false ? 0 : 1;
        task.checker_code = '';
        task.checker_language = '';

        if(is_checker){
            task.checker_code = checker_code;
            task.checker_language = checker_language;
            if (task.checker_language?.length == 0 && task.checker_code?.length == 0) {
                message("Немаэ коду чекера", false);
                return;
        }
        }


        localStorage.setItem(id, JSON.stringify(task));

        message("Дані збережені", true);

    }
    function check(value, min, max) {
        const regex = /^\d+$/;

        if (!regex.test(value)) {
        return false; 
        }

        const numericValue = parseFloat(value);
  
        if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
            return true; 
        }

        return false; 
    }


    function upload_file(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            const fileName = file.name.toLowerCase();
            reader.onload = function(e) {
                checker_code = e.target.result.toString();

                if (fileName.endsWith('.js')) {
                    checker_language = "Node.js (20.x)"
                } else if (fileName.endsWith('.py')) {
                    checker_language = "Python 3 (3.10)"
                } else if (fileName.endsWith('.cpp')) {
                    checker_language = "C++ 17 (g++ 11.2)"
                } else if (fileName.endsWith('.c')) {
                    checker_language = "C 17 (gcc 11.2)"
                } else if (fileName.endsWith('.cs')) {
                    checker_language = "C# (Mono 6.8)"
                } 
            };
            reader.readAsText(file);
            message("Чеккер підвантажений", true)
        } else {
            message("Помилка", false)
        }
    }
</script>



<svelte:head>
    <title>Create task</title>
</svelte:head>

<main class="col-md-12 col-lg-9">
    <div class="row">
        <div style="display: inline-block" class="col-md-12 col-lg-4">
            <p>Назва</p>
            <input type="text" id="task_name" bind:value={name}>
        </div>
    
        <div style="display: inline-block" class="col-md-12 col-lg-4">
            <p>Час виконання</p>
            <input type="number" min="1" max="10" step="1" id="time_limit" bind:value={time_limit}>
        </div>
    
        <div style="display: inline-block" class="col-md-12 col-lg-4">
            <p>Обсяг пам'яті</p>
            <input type="number" min="4" max="1024" step="1" id="memory_limit" style="margin-right: 0;" bind:value={memory_limit}>
        </div>

    </div>
    <div class="row">
        <div class="col-md-12">
            <div style="display: flex;">
                <input type="checkbox" id="myCheckbox" class="checkbox" bind:checked={is_checker}>
                <p style="margin-left: 5px;">Використати кастомний чеккер</p>
            </div>
        </div>

        {#if is_checker}
            <div class="col-12 col-lg-6">
                <input class="checkbox-custom" type="file" accept=".js, .py, .c, .cs, .cpp" style="display: none;" name ="upload_file" on:change={upload_file}>
                <button on:click={() => document.querySelector("input[name=upload_file]").click()} class="submit_button">Підвантажити файл</button>
            </div>
            <div class="col-12 col-lg-6 d-flex justify-content-center align-items-center">
                <p>{checker_language}</p>
            </div>
        {/if}

    </div>
    <br>
    <div class="row">
        <div class="col-md-12">
            <button on:click={save}>Зберегти зміни</button>
        </div> 
    </div>


    

</main>

<style>
    p{
       color:white;
       font-family: "e-Ukraine";
       font-size: 22px;
   }
   input{
        color: white;
        font-size: 16px;
        font-family: "e-Ukraine";
        outline: none;
        border: none;
        background-color: #333333;
        border-radius: 5px;
        width: 100%;
        height: 56px;
        margin-top: 7px;
        margin-bottom: 20px;
    
   }
   button{
        outline: none;
        border: none;
        height: 60px;
        width: 100%;
        background-color: #28743b;
        border-radius: 5px;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        display:flex;
        align-items: center; 
        justify-content: center; 
    }
    .checkbox {
        outline: none;
        border: none;
        height: 20px;
        width: 20px;
        border-radius: 5px;
    }

</style>