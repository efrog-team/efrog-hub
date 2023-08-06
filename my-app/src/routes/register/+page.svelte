<script>
    let login;
    let email;
    let password;

    async function create_account () {
        //тут проверку значений
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ login, email, password }),
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
    <title>Register</title>
</svelte:head>

<main>
    <div style="padding: 2vw;">
        <p>Login</p>
        <input type="text" bind:value={login}>
        <p>Email</p>
        <input type="email" bind:value={email}>
        <p>Password</p>
        <input type="text" bind:value={password}>
        <br>
        <button on:click={create_account}>створити акаунт</button>
        
    </div>

</main>