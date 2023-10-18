<script>
    import { onMount } from 'svelte';
    import {message} from '$lib/message.js'
    export let data;
    let id, name, time_limit, memory_limit,  task;

    onMount(() => {
        id = data.task_id;
        name = data.task.name;
        time_limit = data.task.time_limit;
        memory_limit = data.task.memory_limit;
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
        if(name == task.name && time_limit == task.time_limit && memory_limit == task.memory_limit){
            message("Дані не змінилися", false);
            return 1;
        }
        task.name = name;
        task.time_limit = time_limit;
        task.memory_limit = memory_limit;

        localStorage.setItem(id, JSON.stringify(task));

        message("Дані збережені", true);

    }
    function check(value, min, max) {
        const regex = /^(\d+(\.\d*)?|\.\d+)$/;

        if (!regex.test(value)) {
        return false; 
        }

        const numericValue = parseFloat(value);
  
        if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
            return true; 
        }

        return false; 
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
            <input type="text" id="time_limit" bind:value={time_limit}>
        </div>
    
        <div style="display: inline-block" class="col-md-12 col-lg-4">
            <p>Обсяг пам'яті</p>
            <input type="text" id="memory_limit" style="margin-right: 0;" bind:value={memory_limit}>
        </div>
    </div>
    
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
</style>