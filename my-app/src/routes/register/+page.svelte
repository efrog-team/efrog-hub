<script>
    let login;
    let email;
    let password;
    let err;
    let valid_login = new RegExp(/^[A-Za-z0-9_-]{4,45}$/);
    let valid_email = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

    async function create_account () {
        //тут проверку значений
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ login, email, password }),
        });
        err = await response.json();

        if (err == "Акаунт успішнго створений"){
            let anchor = document.createElement('a');
            anchor.href = "/login";
            anchor.style = "display: none";
            anchor.click();
            anchor.remove();
        }
    }

</script>


<svelte:head>
    <title>Register</title>
</svelte:head>

<main>
    <div style="padding: 2vw;">
        <p>Login</p>
        <input type="text" bind:value={login}>
        {#if login != undefined && !valid_login.test(login)}
            <p style="color:red; font-size: 16px">Логін має скаладатись як мінімум з 4 символів, написаних латинецею, може містити цифри та "-" з "_"</p>
        {/if}

        <p>Email</p>
        <input type="email" bind:value={email}>
        {#if email != undefined && !valid_email.test(email)}
            <p style="color:red; font-size: 16px">Введіть коректний email</p>
        {/if}

        <p>Password</p>
        <input type="text" bind:value={password}>
        {#if password != undefined && password.length < 4}
            <p style="color:red; font-size: 16px">Пароль має скаладатись як мінімум з 4 символів</p>
        {/if}
        
        <p style="font-size: 18px;">Є акаунт? <a href="/login" style="color:white">Увійти</a></p> 
        <button on:click={create_account}>Cтворити акаунт</button>
        {#if err}
            <p>{err}</p>
        {/if}
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
