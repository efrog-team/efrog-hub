<script>
  
  async function upload_file(event) {
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/task/finish/upload-file-polygon', {
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
  <button>hello</button>

  <div class="container text-center">
    <div class="row">
      <div class="col-8">
        1 of 2
      </div>
      <div class="col-4">
        2 of 2
      </div>
    </div>
    <div class="row">
      <div class="col-1">
        1 of 3
      </div>
      <div class="col-3">
        2 of 3
      </div>
      <div class="col-8">
        3 of 3
      </div>
    </div>
  </div>
</main>

