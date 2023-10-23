<script>
    import  {message} from '$lib/message.js'
    import { onMount } from 'svelte';
    export let data;
    let id, test, test_amount, task;
    // let textareas = [];
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
        // for(let i = 0; i < test.length; i++){
        //     textareas.push(1);

        // }
        // console.log(textareas)

        // textareas.forEach(textarea => {
        //     console.log(1)
        //     resize({ target: textarea });
        // });

    });

    function resize(event) {
        const getElement = event.target;
        getElement.style.height = "auto";
        getElement.style.height = Math.max(getElement.scrollHeight, getElement.offsetHeight) + "px";
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

    function add_test() {
        test.push({test_id: test.length + 1 , input: "", output: "", status: "Closed"});
        test = test;
    }

    function delete_test(event) {
        const buttonName = Number(event.currentTarget.name);
        test.splice(buttonName, 1);
        test = test;
    }

</script>



<svelte:head>
    <title>Create task</title>
</svelte:head>

<main class="col-md-12 col-lg-9">
    <p>Тести</p>
    {#if test}
        {#each test as test, i}
            <div class="row">

                <details>
                    <summary>
                        <p>Тест {i + 1}</p>     
                        <button class="delete_button" name={i} on:click={delete_test}>
                            <svg  name={i} width="35" xmlns="http://www.w3.org/2000/svg" height="35" viewBox="0 0 96 96" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" style="color:red; float:right; position:flexbox; margin-right:10px">
                                <path name={i} d="m24,78c0,4.968 4.029,9 9,9h30c4.968,0 9-4.032 9-9l6-48h-60l6,48zm33-39h6v39h-6v-39zm-12,0h6v39h-6v-39zm-12,0h6v39h-6v-39zm43.5-21h-19.5c0,0-1.344-6-3-6h-12c-1.659,0-3,6-3,6h-19.5c-2.487,0-4.5,2.013-4.5,4.5s0,4.5 0,4.5h66c0,0 0-2.013 0-4.5s-2.016-4.5-4.5-4.5z"/>
                            </svg>
                        </button>
      
                    </summary>
                    <div class="row">
                        <div class="col-12">
                            <select class="select" bind:value={test.status}>
                                <option value="Opened">Opened</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 col-lg-6">
                            <p>Вхідні дані</p>
                            <textarea name="input_value" id="input_value" class="test_area"  bind:value={test.input}  on:input={resize}></textarea>
                        </div>
                        <div class="col-md-12 col-lg-6">
                            <p>Вхідні дані</p>
                            <textarea name="output_value" id="output_value" class="test_area" bind:value={test.output} on:input={resize}></textarea>
                    </div> 
                </details>
            </div>
        {/each}
    {/if}


        
    <div class="row">
        <div class="col-12">
            <button class="submit_button" on:click={add_test}>Додати тест</button>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <button class="submit_button" on:click={save}>Зберегти зміни</button>
        </div>
    </div>
    
</main>

<style>
    p{
        color:white;
        font-family: "e-Ukraine";
        font-size: 22px;
        display: inline-block;
    }
    summary{
        color: white;
        background-color: #313030;
        width: 100%;
        height: 60px;
        border-radius: 5px;
        padding-top: 12px;
        padding-bottom: 12px;
        padding-left: 5px;
        margin-bottom: 15px;
    }
    .test_area{
        outline: none;
        border: none;
        background-color: #555454;
        border-radius: 10px;
        width: 100%;
        height: 100px;
        color: white;
        font-size: 16px;
        font-family: "e-Ukraine";
        margin: auto;

    }
    select{
        outline: none;
        border: none;
        background-color: #555454;
        width: 100%;
        height: 50px;
        border-radius: 5px;
        color: white;
        font-size: 18px;
        font-family: "e-Ukraine";
        resize: none;
        display:flex;
        margin-bottom: 5px;
    }

    .delete_button{
        outline: none;
        border: none;
        background-color: transparent;
        float:right;
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
</style>