<script>
    import { page } from '$app/stores';
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

<div style="padding: 2vw;" class="row">


    <div class="task_info col-md-12 col-lg-3">
        <nav class="row">
            <p style="color: #28743b"><b>{data.task.name}</b></p>
            <a class={active_page == 'general-info' ? 'active':''} href="{id}/{version}/general-info">Загальна інформація</a>
            <a class={active_page == 'statement' ? 'active':''} href="{id}/{version}/statement">Умова</a>
            <a class={active_page == 'test' ? 'active':''} href="{id}/{version}/test">Тести</a>
            <a class={active_page == 'preview' ? 'active':''} href="{id}/{version}/preview">Превью</a>
            <a class={active_page == 'finish' ? 'active':''} href="{id}/{version}/finish">Завершення</a>
        </nav>

        
        <details>
            <summary>
                <p class="text" style="display:inline">Автори</p>
            </summary>
                {#each data.author as author}
                    <p>{author.login}: {author.status}</p> 
                {/each} 
        </details>

        <div class="row">
            <div class="col-md-12 gy-1 col-lg-6">
                <input type="text" class="task_input" bind:value={author}>
            </div>
            <div class="col-md-12 gy-1 col-lg-6">
                <button class="task_button" on:click={addAuthor}>+ Автор</button>
            </div>       
        </div>

        

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

        <div class="row">
            {#if data.version.length - 1 > version}
                <div class="col-12">
                    <p align="center" style="color: red">Це стара версія задачі</p>
                </div>
                <div class="col-12">
                    <button class="task_button" style="background-color: red; border: none;" on:click={deleteCommit}>
                        Видалити наступні комміти
                    </button>
                </div>   
                
                
            {:else}
                <div class="col-md-12 gy-1 col-lg-6">
                    <input class="task_input" type="text" bind:value={commitName}>
                </div>
                <div class="col-md-12 gy-1 col-lg-6">
                    <button class="task_button" on:click={commit}>+ Комміт</button>
                </div>  
            {/if}
        </div>

    </div>

    <slot></slot>


</div>




<style>
a, details, p, .task_input, .task_button, .task_info {
    color: white;
    font-family: "e-Ukraine";
}

a, .text {
    font-size: 16px;
}

p {
    font-size: 18px;
}

a {
    display: flex;
    text-decoration: none;
    margin-left: 15px;
}

.active {
    color: #28743b
}

.task_input, .task_button {
    outline: none;
    border: none;
    font-size: 16px;
    background-color: #5c5b5b;
    font-family: "e-Ukraine";
    width: 100%;
    height: 25px;
    border-radius: 5px;
}

.task_button {
    border: 2px solid #28743b; 
}

.task_info {
    background-color: #333333;
    border: 2px solid #28743b;
    border-radius: 5px;
    padding: 5px;
    display: inline;
    float: left;
}

</style>
