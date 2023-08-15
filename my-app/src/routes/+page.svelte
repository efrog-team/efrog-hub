<script>
  let userInput = "";
  let cursorPosition = { start: 0, end: 0 };

  function applyFunctionAndHighlight(event) {
    const div = event.target;
    const selection = window.getSelection();
    cursorPosition.start = getCursorPosition(div, selection, true);
    cursorPosition.end = getCursorPosition(div, selection, false);
    
    const content = div.textContent;
    const highlightedContent = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, content) => {
      const result = yourFunction(content);
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

  function yourFunction(content) {
    if (content.length > 20) {
      return true;
    }
    return false;
  }
</script>

<style>
  .highlighted-div {
    width: 300px;
    height: 200px;
    padding: 5px;
    font-family: monospace;
    border: 1px solid #ccc;
    color: #ccc;
    white-space: pre-wrap;
  }
  
</style>

<main>
  <div class="highlighted-div" contenteditable on:input={applyFunctionAndHighlight}>
    {@html userInput}
  </div>
</main>