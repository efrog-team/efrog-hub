<script>
  async function handleFileUpload(event) {
    const fileInput = event.target;
    if (fileInput.files.length === 0) {
      return; // Ничего не делаем, если файл не выбран
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/create-task', {
        method: 'POST',
        body: formData,
      });

      const total = await response.json();
      console.log(total);
    } catch (error) {
      alert('Произошла ошибка при отправке файла на сервер.');
      console.error(error);
    }
  }
</script>

<style>
 
</style>

<svelte:head>
    <title>Create task</title>
</svelte:head>
<main>
    <div class="content">
        <div style="padding: 5vw;">
            <input type="file" on:change={handleFileUpload} />
        </div>
    </div>
</main>