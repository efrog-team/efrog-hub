<script>
import {message} from '$lib/message'
</script>

<main>
  <button on:click={() => message("Hello, world!", false)}>message</button>
</main>