<script>
    import {generate_formula} from '$lib/database/katex.js'
    import renderMathInElement from 'katex/contrib/auto-render'
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
            statement = task.statement.replace(/<span style="color: green;">/g, '').replace(/<\/span>/g, '').replace(/\n/g, '<br>');
            input_statement = task.input_statement.replace(/<span style="color: green;">/g, '').replace(/<\/span>/g, '').replace(/\n/g, '<br>');
            output_statement = task.output_statement.replace(/<span style="color: green;">/g, '').replace(/<\/span>/g, '').replace(/\n/g, '<br>');
            note = task.note.replace(/<span style="color: green;">/g, '').replace(/<\/span>/g, '').replace(/\n/g, '<br>');
            test = task.test;
        }

        const statementDiv = document.getElementById('statement');
        statementDiv.innerHTML = statement;

        const input_statementDiv = document.getElementById('input_statement');
        input_statementDiv.innerHTML = input_statement;

        const output_statementDiv = document.getElementById('output_statement');
        output_statementDiv.innerHTML = output_statement;

        const noteDiv = document.getElementById('note');
        noteDiv.innerHTML = note;

        renderMathInElement(document.getElementById('content'), {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            {left: "\\(", right: "\\)", display: false},
            {left: "\\begin{equation}", right: "\\end{equation}", display: true},
            {left: "\\begin{align}", right: "\\end{align}", display: true},
            {left: "\\begin{alignat}", right: "\\end{alignat}", display: true},
            {left: "\\begin{gather}", right: "\\end{gather}", display: true},
            {left: "\\begin{CD}", right: "\\end{CD}", display: true},
            {left: "\\[", right: "\\]", display: true}

          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
          // Добавьте другие параметры по необходимости
        });

    })
</script>


<svelte:head>
    <title>Create task</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" crossorigin="anonymous">

    <!-- The loading of KaTeX is deferred to speed up page rendering -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js" integrity="sha384-cpW21h6RZv/phavutF+AuVYrr+dA8xD9zs6FwLpaCct6O9ctzYFfFr4dgmgccOTx" crossorigin="anonymous"></script>
</svelte:head>


  
<main class="col-md-12 col-lg-9">
    <div class="row">
        <div class="col-md-12">
            <div class="preview">
                <p align="center" style="font-size: 22px;">{name}</p>
                <p>Ліміт часу: {time_limit} с</p>
                <p>Ліміт пам'яті: {memory_limit} MB</p>
                <br>
                <div id='content' class="text">
                    {#if statement}
                    <p>Умова</p>
                    {/if}
                    <div id='statement' class="text"></div>

                    {#if input_statement}
                    <p>Вхідні дані</p>
                    {/if}
                    <div id='input_statement' class="text"></div>

                    {#if output_statement}
                    <p>Вихідні дані</p>
                    {/if}
                    <div id='output_statement' class="text"></div>

                    {#if note}
                    <p>Примітки</p>
                    {/if}
                    <div id='note' class="text"></div>
                </div>
                
                
                <p>Приклади</p>

                {#if test}
                    {#each test as test, i}
                        {#if test.status == "Opened"}
                            <p class="text">Приклад {i + 1}</p>
                            <div class="col-12">
                                <table>
                                    <tr>
                                        <th>Вхідні дані</th>
                                        <th>Вихідні дані</th>
                                    </tr>
                                    <tr>
                                        <td>{@html test.input.replace(/\n/g, '<br>')}</td>
                                        <td>{@html test.output.replace(/\n/g, '<br>')}</td>
                                    </tr>
                                </table>
                            </div>

                        {/if}
    
                    {/each}
                {/if}
            </div>
        </div>
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
    color:white;
    font-family: "e-Ukraine";
  }
  .preview{
    background-color: #313030;
    width: 100%;
    margin: 0;
    padding-left: 1vw;
    padding-right: 1vw;
    padding-top: 1px;
    padding-bottom: 1px;
    border-radius: 5px;
  }
    table {
        width: 100%;
        margin-top: 5px;
        margin-bottom: 15px;
        font-size: 14px;
        color: white;
        font-family: "e-Ukraine";
        text-align: center;
        border-spacing: 2px; 
        border-collapse: separate;
    }

    th, td {
        /* background-color: #555454; */
        border: 2px solid #555454;
        border-radius: 5px;
        height: 30px;
    }
    @media(max-width: 992px){
        .preview{
            margin-top: 15px;
        }
    }
</style>