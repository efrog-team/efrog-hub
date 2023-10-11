<script>
  
  async function upload_file(event) {
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/task/finish/upload-file-ejudge-alternative', {
            method: 'POST',
            body: formData,
        });
        if(response.ok){
          const text = await response.json();
          console.log(text);
          return;
        }

        console.log(response);

      }
  
</script>

<main style="padding: 2vw;">
  <input type="file" style="display: none;" name ="upload_file" on:change={upload_file}>
  <button on:click={() => document.querySelector("input[name=upload_file]").click()} class="submit_button" >Підвантажити файл</button>
</main>

