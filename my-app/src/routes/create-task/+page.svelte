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
      <input type="text" bind:value={name}>
      <button on:click={create_task}>Створити задачу</button>
  </div>
</main>

<style>
  input {
      outline: none;
      border: none;
      background-color: #333333;
      border-bottom: 4px solid #28743b;
      width: 44vw;
      height: 56px;
      margin-top: 7px;
      margin-bottom: 44px;
      margin-left: 26vw;
      color: white;
      font-size: 22px;
      font-family: "e-Ukraine";
      display: flex;
  }

  button {
      width: 44vw;
      height: 60px;
      background-color: #28743b;
      border: 4px solid #28743b;
      margin-right: 4vw;
      margin-top: 15px;
      margin-left: 26vw;
      color: white;
      font-size: 22px;
      font-family: "e-Ukraine";
      text-align: center;
      text-decoration: none;
  }
</style>