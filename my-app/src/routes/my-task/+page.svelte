<script>
    export let data;
    let task = data.query

</script>

<style>
    p{
       color:white;
       font-family: "e-Ukraine";
       font-size: 22px;
   }
</style>

<svelte:head>
    <title>Create task</title>
</svelte:head>

<main>
    <div style="padding: 2vw;">
        <p>Мої завдання</p>
        {#each task as task}
            <p>{task.name} {task.status} <a href="task/{task.task_id}/general-info">Перейти до редагування завдання</a></p>
        {/each}
    </div>
</main>