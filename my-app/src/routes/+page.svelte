<script>
  let inputValue = '';
  
  function saveData() {
    localStorage.setItem('dataKey', inputValue);
  }
  
  function loadData() {
    inputValue = localStorage.getItem('dataKey') || '';
  }
</script>

<input bind:value={inputValue} />
<button on:click={saveData}>Сохранить данные</button>
<button on:click={loadData}>Загрузить данные</button>