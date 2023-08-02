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

      if (response.ok) {
        console.log(total);
      } else {
        alert('Произошла ошибка при загрузке файла на сервер.');
      }
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
        <div id="header" class="header">
            <div style="display: inline; float:left; margin-top: 6px; margin-left: 15px;"><a href="\main"><img src="logo.png" class="menu_photo" alt=" "></a></div>
            <div style="display: inline; float:right; margin-top: 6px;"><a href="\for-user"><img src="favicon.png" class="menu_photo" alt=" "></a></div>
            <div style="display: inline; float:right; margin-top: 30px;">   
                <a href="\finding-task" class="menu_text">Задачі</a>
                <a href="\olimpiad" class="menu_text">Олімпіади</a>
            </div>
        </div>
        <div style="padding: 5vw;">
            <input type="file" on:change={handleFileUpload} />
        </div>
    </div>
</main>