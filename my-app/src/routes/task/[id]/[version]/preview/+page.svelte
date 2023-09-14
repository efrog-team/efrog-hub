<script>
    import {generate_formula} from '$lib/database/katex.js'
    let id, name, time_limit, memory_limit, statement, input_statement, output_statement, note, test, task;
    import { onMount } from 'svelte';
    export let data;

    onMount(() => {
        id = data.task_id

        name = data.task.name;
        time_limit = data.task.time_limit;
        memory_limit = data.task.memory_limit;
        statement = data.task.statement;
        input_statement = data.task.input_statement;
        output_statement = data.task.output_statement;
        note = data.task.note;
        test = data.test;

        if (localStorage.getItem(id) != null){
            task = JSON.parse(localStorage.getItem(id));
            name = task.name;
            time_limit = task.time_limit;
            memory_limit = task.memory_limit;
            statement = task.statement;
            input_statement = task.input_statement;
            output_statement = task.output_statement;
            note = task.note;
            test = task.test;
        }

    })
</script>


<svelte:head>
    <title>Create task</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" crossorigin="anonymous">

    <!-- The loading of KaTeX is deferred to speed up page rendering -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js" integrity="sha384-cpW21h6RZv/phavutF+AuVYrr+dA8xD9zs6FwLpaCct6O9ctzYFfFr4dgmgccOTx" crossorigin="anonymous"></script>
</svelte:head>


  
<main style="display: inline-block; margin-left: 1vw;">
        <div class="container">
            <p align="center" style="font-size: 22px;">{name}</p>
            <p>Ліміт часу: {time_limit} с</p>
            <p>Ліміт пам'яті: {memory_limit} MB</p>
            <br>
            
            {#if statement}
                <p>Умова</p>
                {#each statement.split('$$') as fragment, index}
                    {#if index % 2 === 0}
                        <p class="text">{@html fragment.replace(/\n/g, '<br>')}</p>
                    {:else}
                        <p class="text">{@html generate_formula(fragment)}</p>
                    {/if}
                {/each}
            {/if}

      
            {#if input_statement}
                <p>Вхідні дані</p>
                {#each input_statement.split('$$') as fragment, index}
                    {#if index % 2 === 0}
                        <p class="text">{@html fragment.replace(/\n/g, '<br>')}</p>
                    {:else}
                        <p class="text">{@html generate_formula(fragment)}</p>
                    {/if}
                {/each}
            {/if}
            
            {#if output_statement}
                <p>Вихідні дані</p>
                {#each output_statement.split('$$') as fragment, index}
                  {#if index % 2 === 0}
                      <p class="text">{@html fragment.replace(/\n/g, '<br>')}</p>
                  {:else}
                      <p class="text">{@html generate_formula(fragment)}</p>
                  {/if}
                {/each}
            {/if}
      
            {#if note}
                <p>Примітки</p>
                    {#each note.split('$$') as fragment, index}
                    {#if index % 2 === 0}
                       <p class="text">{@html fragment.replace(/\n/g, '<br>')}</p>
                    {:else}
                        <p class="text">{@html generate_formula(fragment)}</p>
                    {/if}
                {/each}
            {/if}
            
            
            <p>Приклади</p>

            {#if test}
                {#each test as test, i}
                    {#if test.status == "Opened"}
                        <p class="text">Приклад {i + 1}</p>
                        <table>
                            <tr>
                                <th>Вхідні дані</th>
                                <th>Вихідні дані</th>
                            </tr>
                            <tr>
                                <td>{test.input}</td>
                                <td>{test.output}</td>
                            </tr>
                        </table>
                    {/if}
  
                {/each}
            {/if}


</main>

<style>
  p{
    color:white;
    font-family: "e-Ukraine";
    font-size: 18px;
  }
  .text{
    display: inline;
    font-size: 14px;
  }
  .container{
    background-color: #313030;
    width: 71vw;
    margin: 0;
    padding-left: 1vw;
    padding-right: 1vw;
    padding-top: 1px;
    padding-bottom: 1px;
    border-radius: 5px;
  }
  table{
      width: 71vw;
      background-color: #555454;
      margin-top: 5px;
      margin-bottom: 15px;
      font-size: 14px;
      color: white;
      font-family: "e-Ukraine";
      text-align: center;
      border-radius: 5px;
  }
  th{
      background-color: #333333;
      height: 35px;
      border-radius: 5px;
  }
  td{
      background-color: #333333;
      height: 30px;
      border-radius: 5px;
  }
</style>