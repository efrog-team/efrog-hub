<script>
    export let data;
    let isBurgerMenuOpen = false;

    function toggleBurgerMenu() {
        isBurgerMenuOpen = !isBurgerMenuOpen;
    }

    function closeBurgerMenu() {
        isBurgerMenuOpen = false;
    }
</script>

<div id="header" class="header">
    <div><a href="/"><img src="/logo.png" class="menu_photo" alt=" "></a></div>

    <nav class="menu">
        <button on:click={toggleBurgerMenu} class="burger-button"><span class="symbol-burger"><b>☰</b></span></button>
        <div class={isBurgerMenuOpen ? "burger-menu open" : "burger-menu"}>
            <a href="/my-task" class="menu_text" on:click={closeBurgerMenu}>Мої задачі</a>
            <a href="/create-task" class="menu_text" on:click={closeBurgerMenu}>Створити задачу</a>

            {#if data.username != undefined}
                <a href="/authorization/logout" on:click={closeBurgerMenu}><p class="menu_text">Вийти з акаунту {data.username}</p></a>
            {:else}
                <a href="/authorization/login" on:click={closeBurgerMenu}><p class="menu_text">Увійти</p></a> 
                <a href="/authorization/register" on:click={closeBurgerMenu}><p class="menu_text">Зареєструватися</p></a> 
            {/if}
        </div>
    </nav>


</div>
<slot></slot>


<style>
    a{
        text-decoration: none;
    }

    .header{
        background-color: #333333;
        border-bottom: 5px solid #28743b;
        height: 80px;
    }
    .menu_photo {
        height: 70px;
        display: inline;
        float: left;
        margin-top: 6px;
        margin-left: 15px;
    }

    .menu {
        display: inline;
        float: right;
        margin-top: 6px;
        margin-right: 15px;
        margin-left: 30px;
        margin-top: 30px;
    }

    .menu_text {
        color: white;
        font-size: 20px;
        font-family: "e-Ukraine";
        text-decoration: none;
        display: inline;
        margin-left: 15px;
    }

    .burger-button {
        display: none;
        background-color: #333333;
        outline: none;
        border: 2px solid #28743b;
        border-radius: 5px;
        padding-bottom: 4px;
        padding-left: 8px;
        padding-right: 8px;
    }
    .symbol-burger{
        font-size: 25pt;
        color: #28743b;
    }

    @media (max-width: 992px) {
        .menu {
            margin-top: 8px;
        }
        .burger-button {
            display: block; 

        }

        .burger-menu {
            display: none; 
        }

        .burger-menu.open {
            display: block; 
            position: absolute;
            top: 85px;
            left: 0;
            width: 100vw;
            height: 100vh;
            padding: 15px;
            background: #1e1e1e;
        }

        .burger-menu.open .menu_text {
            text-align: center;
            margin: 10px auto;
            display: block;
        }

    }
</style>