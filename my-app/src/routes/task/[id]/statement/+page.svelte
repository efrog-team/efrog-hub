<script>
    import { onMount } from 'svelte';
    import { generate_formula } from '$lib/database/katex.js';
    import  {message} from '$lib/message.js';
    
    export let data;
    let id, statement, input_statement, output_statement, note;
  
    onMount(() => {
      id = data.task_id;
      statement = data.task.statement;
      input_statement = data.task.input_statement;
      output_statement = data.task.output_statement;
      note = data.task.note;
    });
  
    async function save () {
        const statementForSend = document.getElementById("statement").innerHTML.replace(/&amp;/g, '&');
        const inputStatementForSend = document.getElementById("input_statement").innerHTML.replace(/&amp;/g, '&');
        const outputStatementForSend = document.getElementById("output_statement").innerHTML.replace(/&amp;/g, '&');
        const noteForSend = document.getElementById("note").innerHTML.replace(/&amp;/g, '&');
        if(statementForSend == data.task.statement && inputStatementForSend == data.task.input_statement && outputStatementForSend == data.task.output_statement && noteForSend == data.task.note){
            message("Дані не змінилися", false);
            return;
        }
        const res = await fetch('/api/task/statement',{
        method: 'POST',
        body: JSON.stringify({statementForSend, inputStatementForSend, outputStatementForSend, noteForSend, id})
        });

        const answ = await res.json();
        if (answ == "Зміни збережені"){
            message(answ, true);
            return;
        }
        message(answ, false);
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
  
  <main>
    <div style="padding: 2vw;">
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
        class="input_statement"
        id="input_statement"
        contenteditable
        on:input={hilightText} >
        {@html input_statement}
      </div>
  
      <p>Умова до вихідних даних</p>
      <div
        class="output_statement"
        id="output_statement"
        contenteditable
        on:input={hilightText}>
        {@html output_statement}
      </div>
  
      <p>Примітки</p>
      <div
        class="note"
        id="note"
        contenteditable
        on:input={hilightText}>
        {@html note}
      </div>
  
      <button on:click={save}>Зберегти зміни</button>
    </div>
  </main>
<style>
    p{
        color:white;
        font-family: "e-Ukraine";
        font-size: 22px;
    }
    button{
        width: 95.5vw;
        height: 60px;
        background-color: #28743b;
        border: 4px solid #28743b;
        margin-right: 4vw;
        margin-top: 15px;
        display:inline;
        float: left;
        color: white;
        font-size: 22px;
        font-family: "e-Ukraine";
        text-align: center;
        text-decoration: none;
    }
    .statement{
        outline: none;
        border: none;
        background-color: #333333;
        border-bottom: 4px solid #28743b;
        width: 95vw;
        color: white;
        font-size: 18px;
        padding: 5px;
        font-family: "e-Ukraine";
        white-space: pre-wrap
    }
    .input_statement{
        outline: none;
        border: none;
        background-color: #333333;
        border-bottom: 4px solid #28743b;
        width: 95vw;
        color: white;
        font-size: 18px;
        padding: 5px;
        font-family: "e-Ukraine";
        white-space: pre-wrap
    }
    .output_statement{
        outline: none;
        border: none;
        background-color: #333333;
        border-bottom: 4px solid #28743b;
        width: 95vw;
        color: white;
        font-size: 18px;
        padding: 5px;
        font-family: "e-Ukraine";
        white-space: pre-wrap
    }
    .note{
        outline: none;
        border: none;
        background-color: #333333;
        border-bottom: 4px solid #28743b;
        width: 95vw;
        color: white;
        font-size: 18px;
        padding: 5px;
        font-family: "e-Ukraine";
        white-space: pre-wrap
    }
</style>