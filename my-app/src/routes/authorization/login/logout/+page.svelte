<script>
    let login;
    let password;
    export let data

    async function get_account () {
        //тут проверку значений
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ login,  password }),
        });

        
        const total = await response.json();
        console.log(total)
    }

</script>

<style>
        p{
        color:white;
        font-family: "e-Ukraine";
        font-size: 22px;
        }
</style>

<svelte:head>
    <title>Logins</title>
</svelte:head>

<main>
    <div style="padding: 2vw;">
        <p>Login</p>
        <input type="text" bind:value={login}>
        <p>Password</p>
        <input type="text" bind:value={password}>
        <br>
        <button on:click={get_account}>Війти в акаунт</button>
        <p>{data.token}</p>
    </div>

</main>