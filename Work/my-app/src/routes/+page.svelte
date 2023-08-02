<script>
    let a = 0;
    let b = 0;
    let total = 0;

    async function add() {
        const response = await fetch('/api', {
            method: 'POST',
            body: JSON.stringify({ a, b }),
        });

        total = await response.json();
        console.log(total)
    }
    async function post() {
        const answer = await fetch('/api', {
            method: 'GET'
        });
        let db = await answer.json();
        console.log(db)
    }
</script>

<style>
</style>

<svelte:head>
    <title>Create task</title>
</svelte:head>

<main>
    <div class="content">
        <div id="header" class="header">
            <div style="display: inline; float:left; margin-top: 6px; margin-left: 15px;"><a href="\main"><img src="logo.png" class="menu_photo" alt=" "></a></div>
            <div style="display: inline; float:right; margin-top: 6px;"><a href="\for-user"><img src="favicon.png" class="menu_photo" alt=" "></a></div>
            <div style="display: inline; float:right; margin-top: 30px;">   
                <a href="\finding-task" class="menu_text">Задачі</a>
                <a href="\olimpiad" class="menu_text">Олімпіади</a>
            </div>
        </div>
        <div class="main">
            <a href="/task">task</a>
            <a href="/create-task">create-task</a>
            <input type="number" bind:value={a}> +
            <input type="number" bind:value={b}> =
            {total}

            <button on:click={add}>Calculate</button>
            
            <button on:click={post}>Conect to db</button>
        </div>
    </div>
</main>