<script>
    import { isReturnStatement } from "typescript";


  let taskId = '';
  
  async function saveData() {
    const res = await fetch('/api/publicate-task',{
      method: 'POST',
      body: JSON.stringify({taskId}),
      headers: {
        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInVzZSI6ImF1dGhyb2l6YXRpb24iLCJleHAiOjE3MjY2Nzg2ODN9.4y2PfdUGaR3_10fqMtJMUYcS4poTjJcfWDVq9VASzFc"
      }
    });
    if(res.ok){
      const answ = await res.json();
      console.log(answ);
      return;
    }
    console.log(res.status)
  }
  
</script>

<input bind:value={taskId} />
<button on:click={saveData}>Сохранить данные</button>
