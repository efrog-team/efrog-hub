<script>
    import { goto } from '$app/navigation';
    import { message } from '$lib/message.js';

    export let data;
    let name;
    let userId = data.userId;

    async function create_task() {
        if (userId == undefined) {
            message("Доступно тільки для зареєстрованих користувачів", false);
            return;
        }
        if (name == undefined) {
            message("Введіть назву задачі", false);
            return;
        }

        const response = await fetch('/api/create-task', {
            method: 'POST',
            body: JSON.stringify({ userId, name }),
        });

        const task_id = await response.json();
        goto(`task/${task_id}/0/general-info`);
    }
</script>

<svelte:head>
    <title>Create task</title>
</svelte:head>

<main>
    <div style="padding: 2vw;">
        <div class="row">
            <div class="col-md-12 gy-3 col-lg-6">
                <input type="text" bind:value={name} class="input" placeholder="Введіть назву задачі">
            </div>
            <div class="col-md-12 gy-3 col-lg-6">
                <button on:click={create_task} class="submit_button">Створити задачу</button>
            </div>
        </div>
    </div>
</main>

<style>
    /* Общие стили для input и button */
    .input, .submit_button {
        outline: none;
        width: 100%;
        height: 60px;
        border-radius: 5px;
        font-family: "e-Ukraine";
        font-size: 22px;
        color: white;
    }

    /* Стили для input */
    .input {
        background-color: #333333;
        border: none;
    }

    input::-webkit-input-placeholder {
        text-align: center;
    }

    /* Стили для button */
    .submit_button {
        background-color: #28743b;
        border: 4px solid #28743b;
        text-align: center;
    }
</style>
