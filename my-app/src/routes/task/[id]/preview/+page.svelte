<script>
    import {generate_formula} from '$lib/database/katex.js'
    export let data;
</script>


<svelte:head>
    <title>Create task</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" crossorigin="anonymous">

    <!-- The loading of KaTeX is deferred to speed up page rendering -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js" integrity="sha384-cpW21h6RZv/phavutF+AuVYrr+dA8xD9zs6FwLpaCct6O9ctzYFfFr4dgmgccOTx" crossorigin="anonymous"></script>
</svelte:head>


  
<main>
    <div style="padding: 2vw;">
        <div class="container">
            <p align="center" style="font-size: 22px;">{data.task.name}</p>
            <p>Ліміт часу: {data.task.time_limit} с</p>
            <p>Ліміт пам'яті: {data.task.memory_limit} MB</p>
            <br>
            
            {#if data.task.statement}
                <p>Умова</p>
                {#each data.task.statement.split('$$') as fragment, index}
                    {#if index % 2 === 0}
                        <p class="text">{@html fragment.replace(/\n/g, '<br>')}</p>
                    {:else}
                        <p class="text">{@html generate_formula(fragment)}</p>
                    {/if}
                {/each}
            {/if}

      
            {#if data.task.input_statement}
                <p>Вхідні дані</p>
                {#each data.task.input_statement.split('$$') as fragment, index}
                    {#if index % 2 === 0}
                        <p class="text">{@html fragment.replace(/\n/g, '<br>')}</p>
                    {:else}
                        <p class="text">{@html generate_formula(fragment)}</p>
                    {/if}
                {/each}
            {/if}
            
            {#if data.task.output_statement}
                <p>Вихідні дані</p>
                {#each data.task.output_statement.split('$$') as fragment, index}
                  {#if index % 2 === 0}
                      <p class="text">{@html fragment.replace(/\n/g, '<br>')}</p>
                  {:else}
                      <p class="text">{@html generate_formula(fragment)}</p>
                  {/if}
                {/each}
            {/if}
      
            {#if data.task.note}
                <p>Примітки</p>
                    {#each data.task.note.split('$$') as fragment, index}
                    {#if index % 2 === 0}
                       <p class="text">{@html fragment.replace(/\n/g, '<br>')}</p>
                    {:else}
                        <p class="text">{@html generate_formula(fragment)}</p>
                    {/if}
                {/each}
            {/if}
            
            
            <p>Приклади</p>

            {#each data.test as test, i}
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
            {/each}
      </div>
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
    width: 90vw;
    margin: auto;
    padding-left: 1vw;
    padding-right: 1vw;
    padding-top: 1px;
    padding-bottom: 1px;
  }
  table{
      width: 90vw;
      background-color: #555454;
      margin-top: 5px;
      margin-bottom: 15px;
      font-size: 14px;
      color: white;
      font-family: "e-Ukraine";
      text-align: center;
  }
  th{
      background-color: #333333;
      height: 35px;
  }
  td{
      background-color: #333333;
      height: 30px;
  }
</style>