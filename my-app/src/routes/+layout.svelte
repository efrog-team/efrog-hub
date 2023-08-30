<script>
    export let data;
</script>

<div id="header" class="header">
    <div style="display: inline; float:left; margin-top: 6px; margin-left: 15px;"><a href="/"><img src="/logo.png" class="menu_photo" alt=" "></a></div>
    <div style="display: inline; float:right; margin-top: 6px; margin-right: 15px; margin-left:15px; margin-top: 30px;">
            {#if data.username != undefined}
                <a href="/authorization/logout" style="text-decoration: none;"><p class="menu_text">Вийти з акаунту {data.username}</p></a>
            {:else}
                <a href="/authorization/login" style="text-decoration: none;"><p class="menu_text">Увійти</p></a> 
                <a href="/authorization/register" style="text-decoration: none;"><p class="menu_text">Зареэструватись</p></a> 
            {/if}
    </div>
    <div style="display: inline; float:right; margin-top: 30px;">   
        <a href="/my-task" class="menu_text">Мої задачі</a>
        <a href="/create-task" class="menu_text">Створити задачу</a>
    </div>
</div>
<slot></slot>