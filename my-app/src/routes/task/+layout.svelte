<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    let id
    let active_page

    page.subscribe((record)=>{
        id = (record.url.pathname.match(/^\/task\/[^/]+/) || [""])[0];
        active_page = record.url.pathname.replace(id, "");
    });
</script>

<div style="padding: 2vw;">
    <a class={active_page == '/general-info' ? 'active':''} href="{id}/general-info">Загальна інформація</a>
    <a class={active_page == '/statement' ? 'active':''} href="{id}/statement">Умова</a>
    <a class={active_page == '/test' ? 'active':''} href="{id}/test">Тести</a>
    <a class={active_page == '/finish' ? 'active':''} href="{id}/finish">Завершення</a>
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
    .active {
        color: #28743b
    }
</style>
<slot></slot>