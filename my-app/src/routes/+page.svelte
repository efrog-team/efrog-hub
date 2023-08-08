<script>
    async function create_task () {
        const response = await fetch('/api/authorization/register', {
            method: 'POST',
            body: JSON.stringify({ login, email, password }),
        });
        err = await response.json();

    }
</script>

<style>
</style>

<svelte:head>
    <title>Create task</title>
</svelte:head>

<main>
        <div style="padding: 2vw;">
            <a href="/task1">task</a><br>
            <a href="/create-task">create-task</a><br>
            <a href="/register">register</a><br>
            <a href="/authorization/login">login</a><br>
            <a href="task/2/general-info">d</a>
            <button on:click={create_task}>Створити завдання</button>
        </div>
</main>