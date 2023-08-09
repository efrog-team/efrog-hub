<script>
    import { invalidateAll } from '$app/navigation';

    export let data;
    let task = data.query[0]
    let id = data.task_id;
    let name = task.name;
    let time_limit = task.time_limit;
    let memory_limit = task.memory_limit;
    let author


    async function save () {
        const res = await fetch('/api/task1/general-info',{
        method: 'POST',
        body: JSON.stringify({name, time_limit, memory_limit, id})
        });

        const answ = await res.json();
        console.log(answ)
    }
    async function add_author () {
        const res = await fetch('/api/add_author',{
        method: 'POST',
        body: JSON.stringify({author, id})
        });
        invalidateAll()
        const answ = await res.json();
        console.log(answ)
    }
</script>



<svelte:head>
    <title>Create task</title>
</svelte:head>

<main>
    <div style="padding: 2vw;">
        <div style="display: inline; float:left;">
            <p>Назва</p>
            <input type="text" id="task_name" bind:value={name}>
            <p>Час виконання</p>
            <input type="text" id="time_limit" bind:value={time_limit}>
            <p>Обсяг пам'яті</p>
            <input type="text" id="memory_limit" bind:value={memory_limit}>
            <button on:click={save}>Зберегти зміни</button>
        </div>
        <div style="display: inline; float:left;">
            <p>Автори</p>
            <table>
                <tr>
                    <th>Login</th>
                    <th>Авторство</th>
                </tr>
                {#each data.author as author}
                    <tr>
                        <td>{author.login}</td>
                        <td>{author.status}</td>
                    </tr>
                {/each}
            </table>
            <input style="display: inline; float: left; margin-right: 1.7vw; margin-top: 15px; width: 34vw" type="text" id="author" bind:value={author}>
            <button style="display: inline; float: left; width: 34vw; margin-right: 0;" on:click={add_author}>Додати співавтора</button>
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
       outline: none;
       border: none;
       background-color: #333333;
       border-bottom: 4px solid #28743b;
       width: 20vw;
       height: 56px;
       margin-top: 7px;
       margin-bottom: 44px;
       color: white;
       font-size: 22px;
       font-family: "e-Ukraine";
       display:flex;
   }
   button{
        width: 20vw;
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
    table{
        width: 70vw;
        background-color: #28743b;
        margin-top: 15px;
        font-size: 18px;
        color: white;
        font-family: "e-Ukraine";
        text-align: center;
    }
    th{
        background-color: #252526;
        height: 35px;
    }
    td{
        background-color: #333333;
        height: 30px;
    }
</style>