<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import {invalidateAll} from '$app/navigation'
    import {goto} from '$app/navigation'
    import  {message} from '$lib/message.js';
    let id, version, active_page, commitName, author;
    export let data;
    let task_id = data.task_id;

    async function commit () {
        if (commitName == undefined){
            message("Введіть назву коміту");
            return;
        }
        const task = JSON.parse(localStorage.getItem(data.task_id));
        

        const res = await fetch("/api/task/commit",{
            method: "POST",
            body: JSON.stringify({task, commitName, task_id})
        });
        
        const answ = await res.json();
        if (answ == "Дані збережені"){
            message(answ, true);
            goto(`${id}/${Number(version) + 1}/general-info`);
            return;
        }
        message(answ, false);
       
    }


    page.subscribe((record)=>{
        id = (record.url.pathname.match(/^\/task\/[^/]+/) || [""])[0];
        active_page = record.url.pathname.replace(id, "");
        active_page = active_page.split("/")
        version = active_page[1];
        active_page = active_page[2]
    });


    function oldCommit (version) {
        localStorage.removeItem(task_id);
        let anchor = document.createElement('a');
        anchor.href = `${id}/${version}/general-info`;
        anchor.style = "display: none";
        anchor.click();
        anchor.remove();
    }

    async function deleteCommit () {
        const res = await fetch("/api/task/delete-commit", {
            method: "POST",
            body: JSON.stringify({task_id, version})
        });
        const answ = await res.json();
        invalidateAll();
    }

    async function addAuthor () {
        const res = await fetch('/api/add-author',{
        method: 'POST',
        body: JSON.stringify({author, task_id})
        });
        invalidateAll()
        const answ = await res.json();
        if (answ == "Автора додано"){
            message(answ, true);
            return;
        }
        message(answ, false);
    }

</script>

<div style="padding: 2vw;">
    <div style="display: flex; margin-bottom: 15px;">
        <a class={active_page == 'general-info' ? 'active':''} href="{id}/{version}/general-info">Загальна інформація</a>
        <a class={active_page == 'statement' ? 'active':''} href="{id}/{version}/statement">Умова</a>
        <a class={active_page == 'test' ? 'active':''} href="{id}/{version}/test">Тести</a>
        <a class={active_page == 'preview' ? 'active':''} href="{id}/{version}/preview">Превью</a>
        <a class={active_page == 'finish' ? 'active':''} href="{id}/{version}/finish">Завершення</a>
    </div>


    <div class="task_info">
        <p style="color: #28743b"><b>{data.task.name}</b></p>
        <p class="text">Загальна інформація</p>
        <p class="text">Умова</p>
        <p class="text">Тести</p>

        <details>
            <summary>
                <p class="text" style="display:inline">Автори</p>
            </summary>
                {#each data.author as author}
                    <p>{author.login}: {author.status}</p> 
                {/each} 
        </details>

        <input type="text" class="task_input" bind:value={author}>
        <button class="task_button" on:click={addAuthor}>+ Автор</button>
        

        <details>
            <summary>
                <p class="text" style="display:inline">Історія створення</p>
            </summary>
            {#each data.version as commit}
                <button class="button"  on:click={() => oldCommit(commit.version)}>
                    {commit.version}. {commit.version_name}
                </button>
            {/each}
        </details>

        {#if data.version.length - 1 > version}
            <p align="center" style="color: red">Це стара версія задачі</p>
            <button class="task_button" style="background-color: red; border: none; width: 20vw; margin-left:0;" on:click={deleteCommit}>Видалити наступні комміти</button>
        {:else}
            <div style="display: flex">
                <input class="task_input" type="text" bind:value={commitName}>
                <button class="task_button" on:click={commit}>+ Комміт</button>
            </div>
        {/if}
    </div>

    <slot></slot>


</div>




<style>
    a{
        color:white;
        font-family: "e-Ukraine";
        font-size: 22px;
        display: inline;
        float: left;
        text-decoration: none;
        margin-left: 15px;
    }
    details{
        color: white;
    }
    p{
    color:white;
    font-family: "e-Ukraine";
    font-size: 18px;
    }
    .active {
        color: #28743b
    }
    .text{
        font-size: 16px;
    }
    .task_input{
        color: white;
        font-size: 16px;
        font-family: "e-Ukraine";
        outline: none;
        border: none;
        background-color: #5c5b5b;
        border-radius: 5px;
        display: inline-block;
        width: 9vw;
    }
    .task_button{
        color: white;
        font-size: 16px;
        font-family: "e-Ukraine";
        outline: none;
        border: none;
        background-color: #5c5b5b;
        border: 2px solid #28743b;
        border-radius: 5px;
        display: inline-block;
        width: 9vw;
        margin-left: 15px;
    }
    .button{
        width: 18vw;
        background-color: #333333;
        color: #28743b;
        font-size: 16px;
        font-family: "e-Ukraine";
        text-align: center;
        text-decoration: none;
        margin-right: 4vw;
        margin-top: 15px;
        outline: none;
        border: none;
        display: flex;
    }

    .task_info{
        background-color: #333333;
        border: 2px solid #28743b;
        border-radius: 5px;
        width: 20vw;
        padding: 5px;
        display: inline;
        float: left;

    }
</style>
