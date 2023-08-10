<script>
 import Katex from 'svelte-katex';

let textWithFormulas = `Это некоторый текст с формулами. Вот пример формулы: $$E = mc^2$$. Также есть другая формула: $$\\frac{1}{\\sigma\\sqrt{2\\pi}}\\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$.`;
</script>


<svelte:head>
    <title>Create task</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css" integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ" crossorigin="anonymous">
</svelte:head>

<style>
    .math-formula {
      font-size: 22px;
      color:white
    }
    p{
        color:white;
        font-family: "e-Ukraine";
        font-size: 18px;
        display: inline;
    }
</style>
  
<main>
    <div style="padding: 2vw;">
        {#each textWithFormulas.split('$$') as fragment, index}
        {#if index % 2 === 0}
          <p>{fragment}</p>
        {:else}
          <p class="math-formula"><Katex>{fragment}</Katex></p>
        {/if}
      {/each}
    </div>

</main>