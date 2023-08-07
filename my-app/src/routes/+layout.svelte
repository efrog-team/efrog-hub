<script>
    import {invalidateAll } from '$app/navigation';
    export let data;

    async function logout () {
        const res = await fetch('/api/logout', {method: "PUT"});
        invalidateAll()
    }
</script>

<div id="header" class="header">
    <div style="display: inline; float:left; margin-top: 6px; margin-left: 15px;"><a href="/"><img src="logo.png" class="menu_photo" alt=" "></a></div>
    <div style="display: inline; float:right; margin-top: 6px; margin-right: 15px; margin-left:15px; margin-top: 30px;">
            {#if data.login != undefined}
                <button on:click={logout} class="menu_text" style="outline: none; border: none; background:none; margin-top: 0px; ">Вийти з акаунту {data.login}</button>
            {:else}
                <a href="/login" style="text-decoration: none;"><p class="menu_text">Увійти в акаунт</p></a> 
            {/if}
    </div>
    <div style="display: inline; float:right; margin-top: 30px;">   
        <a href="/" class="menu_text">Пошук задач</a>
        <a href="/" class="menu_text">Створити задачу</a>
    </div>
</div>
<slot></slot>