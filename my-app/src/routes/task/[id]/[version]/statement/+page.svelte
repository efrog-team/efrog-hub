<script>
    import { onMount } from 'svelte';
    import { generate_formula } from '$lib/database/katex.js';
    import {message} from '$lib/message.js'
    
    export let data;
    let id, statement, input_statement, output_statement, note, task;

    onMount(() => {
        id = data.task_id;
        statement = data.task.statement;
        input_statement = data.task.input_statement;
        output_statement = data.task.output_statement;
        note = data.task.note;
        if (localStorage.getItem(id) == null){
            localStorage.setItem(id, JSON.stringify({...data.task, test: data.test}));
            task = JSON.parse(localStorage.getItem(id));
        }
        else {
            task = JSON.parse(localStorage.getItem(id));
            if (statement != task.statement){
                statement = task.statement;
            }
            if (input_statement != task.input_statement){
                input_statement = task.input_statement;
            }
            if (output_statement != task.output_statement){
                output_statement = task.output_statement;
            }
            if (note != task.note){
                note = task.note;
            }
        }
  
    });
  
  
    async function save () {
        const statementForSend = document.getElementById("statement").innerHTML.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        const inputStatementForSend = document.getElementById("input_statement").innerHTML.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        const outputStatementForSend = document.getElementById("output_statement").innerHTML.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        const noteForSend = document.getElementById("note").innerHTML.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        if(statementForSend == task.statement && inputStatementForSend == task.input_statement && outputStatementForSend == task.output_statement && noteForSend == task.note){
            message("Дані не змінилися", false);
            return;
        }

        task.statement = statementForSend;
        task.input_statement = inputStatementForSend;
        task.output_statement = outputStatementForSend;
        task.note = noteForSend;

        localStorage.setItem(id, JSON.stringify(task));

        message("Дані збережені", true);

    }

  
    let cursorPosition = { start: 0, end: 0 };
  
    function hilightText(event) {
      const div = event.target;
      const selection = window.getSelection();
      cursorPosition.start = getCursorPosition(div, selection, true);
      cursorPosition.end = getCursorPosition(div, selection, false);
      
      const content = div.textContent;
      const highlightedContent = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, content) => {
        const result = generate_formula(content);
        const color = result ? 'green' : 'red';
        return `<span style="color: ${color};">$$${content}$$</span>`;
      });
      div.innerHTML = highlightedContent;
  

      restoreCursorPosition(div);
    }
  
    function getCursorPosition(element, selection, isStart) {
      const range = document.createRange();
      range.selectNodeContents(element);
  
      if (isStart) {
        range.setEnd(selection.anchorNode, selection.anchorOffset);
      } else {
        range.setEnd(selection.focusNode, selection.focusOffset);
      }
  
      return range.toString().length;
    }
  
    function restoreCursorPosition(element) {
      const selection = window.getSelection();
      const range = document.createRange();
      const startOffset = calculateOffset(element, cursorPosition.start);
      const endOffset = calculateOffset(element, cursorPosition.end);
  
      range.setStart(startOffset.node, startOffset.offset);
      range.setEnd(endOffset.node, endOffset.offset);
  
      selection.removeAllRanges();
      selection.addRange(range);
    }
  
    function calculateOffset(node, targetOffset) {
      let currentOffset = 0;
  
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT + NodeFilter.SHOW_ELEMENT, null, false);
  
      while (walker.nextNode()) {
        const currentNode = walker.currentNode;
        const nodeLength = currentNode.nodeType === Node.TEXT_NODE ? currentNode.length : 0; // For span nodes
  
        if (currentOffset + nodeLength >= targetOffset) {
          const offsetWithinNode = targetOffset - currentOffset;
          return {
            node: currentNode,
            offset: currentNode.nodeType === Node.TEXT_NODE ? offsetWithinNode : offsetWithinNode + 1,
          };
        }
  
        currentOffset += nodeLength;
      }
  
      return { node: node, offset: 0 };
    }
  </script>
  
  <svelte:head>
    <title>Create task</title>
  </svelte:head>


  <main style="display: inline-block; margin-left: 1vw;">
    <p>Умова</p>
    <div
      class="statement"
      id="statement"
      contenteditable
      on:input={hilightText}>
      {@html statement}
    </div>

    <p>Умова до вхідних даних</p>
    <div
    class="statement"
      id="input_statement"
      contenteditable
      on:input={hilightText} >
      {@html input_statement}
    </div>

    <p>Умова до вихідних даних</p>
    <div
      class="statement"
      id="output_statement"
      contenteditable
      on:input={hilightText}>
      {@html output_statement}
    </div>

    <p>Примітки</p>
    <div
      class="statement"
      id="note"
      contenteditable
      on:input={hilightText}>
      {@html note}
    </div>


    <button on:click={save}>Зберегти зміни</button>

</main>

<style>
    p{
        color:white;
        font-family: "e-Ukraine";
        font-size: 22px;
    }
    button{
        outline: none;
        border: none;
        width: 73.5vw;
        height: 60px;
        background-color: #28743b;
        border-radius: 5px;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        display:flex;
        align-items: center; 
        justify-content: center; 
        margin-top: 15px;
    }
    .statement{
        outline: none;
        border: none;
        background-color: #333333;
        border-radius: 5px;
        width: 72.5vw;
        color: white;
        font-size: 18px;
        padding: 5px;
        font-family: "e-Ukraine";
        white-space: pre-wrap;
        display: inline-block;
    }
</style>