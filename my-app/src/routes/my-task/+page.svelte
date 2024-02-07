<script>
    export let data;
    let task = data.query;
</script>

<svelte:head>
    <title>Create task</title>
</svelte:head>

<main>
    <div style="padding: 2vw;">
        <p>Мої задачі</p>
        <table>
            <tr>
                <th>ID задачі</th>
                <th>Назва задачі</th>
                <th>Авторство</th>
                <th>Дії</th>
            </tr>
            {#each task as task}
                <tr>
                    <td>{task.task_id}</td>
                    <td>{task.name}</td>
                    <td>{task.status}</td>
                    <td><a href="task/{task.task_id}/{task.version}/general-info">Редагувати</a></td>
                </tr>
            {/each}
        </table>
    </div>
</main>

<style>
    p, a {
        color: white;
        font-family: "e-Ukraine";
        text-decoration: none;
    }

    p {
        font-size: 22px;
    }

    a {
        font-size: 18px;
    }

    table {
        width: 96vw;
        background-color: #28743b;
        margin-top: 15px;
        font-size: 18px;
        color: white;
        font-family: "e-Ukraine";
        text-align: center;
    }

    th {
        background-color: #252526;
        height: 35px;
    }

    td {
        background-color: #333333;
        height: 30px;
    }

    @media (max-width: 768px) {
        p {
            font-size: 16px;
            text-align: center;
        }

        a, table {
            font-size: 16px;
        }

        th, td {
            height: 25px;
        }
    }

    @media (max-width: 576px) {
        p, a {
            font-size: 12px;
        }

        table {
            font-size: 12px;
        }

        th, td {
            height: 15px;
        }
    }
</style>