<script>
    import {invalidateAll } from '$app/navigation';
    let login;
    let password;
    let err;

    async function get_account () {
        //тут проверку значений
        const response = await fetch('/api/authorization/login', {
            method: 'POST',
            body: JSON.stringify({ login,  password }),
        });
        invalidateAll()
    }

</script>

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
        width: 15vw;
        height: 56px;
        margin-top: 7px;
        margin-bottom: 44px;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        display:flex;
    }
    button{
        width: 15vw;
        height: 60px;
        background-color: #28743b;
        border: 4px solid #28743b;
        margin-right: 4vw;
        margin-top: 15px;

        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        text-align: center;
        text-decoration: none;
    }
</style>

<svelte:head>
    <title>Login</title>
</svelte:head>

<main>
    <div style="padding: 2vw;">
        <p>Login</p>
        <input type="text" bind:value={login}>
        <p>Password</p>
        <input type="text" bind:value={password}>
        <p style="font-size: 18px;">Немаэ акаунту? <a href="/authorization/register" style="color:white">Створити</a></p> 
        <button on:click={get_account}>Увійти в акаунт</button>

        {#if err}
            <p>{err}</p>
        {/if}
    </div>

</main>