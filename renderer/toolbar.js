(() => {
  const toolBtns = document.querySelectorAll('.tool-btn');
  const colorBtns = document.querySelectorAll('.color-btn');
  const sizeBtns = document.querySelectorAll('.size-btn');
  const clearBtn = document.getElementById('clear-btn');
  const closeBtn = document.getElementById('close-btn');
  const toolbar = document.getElementById('toolbar');

  const toolMap = { pen: 'pen', highlighter: 'highlighter', rect: 'rect', circle: 'circle', arrow: 'arrow', line: 'line', text: 'text', eraser: 'eraser' };

  toolBtns.forEach(btn => btn.addEventListener('click', () => {
    toolBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    DrawingEngine.setTool(toolMap[btn.dataset.tool]);
  }));

  colorBtns.forEach(btn => btn.addEventListener('click', () => {
    colorBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    DrawingEngine.setColor(btn.dataset.color);
  }));

  sizeBtns.forEach(btn => btn.addEventListener('click', () => {
    sizeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    DrawingEngine.setSize(parseInt(btn.dataset.size));
  }));

  clearBtn.addEventListener('click', () => {
    if (confirm('确定清除所有画笔内容？')) DrawingEngine.clearAll();
  });

  closeBtn.addEventListener('click', () => window.electronAPI.toggleMode());

  // 工具栏拖拽
  let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
  toolbar.addEventListener('mousedown', (e) => {
    if (e.target === toolbar || e.target.classList.contains('toolbar-section') || e.target.classList.contains('toolbar-divider')) {
      isDragging = true;
      dragOffsetX = e.clientX - toolbar.offsetLeft;
      dragOffsetY = e.clientY - toolbar.offsetTop;
      e.preventDefault();
    }
  });
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      toolbar.style.left = (e.clientX - dragOffsetX) + 'px';
      toolbar.style.top = (e.clientY - dragOffsetY) + 'px';
      toolbar.style.transform = 'none';
    }
  });
  document.addEventListener('mouseup', () => { isDragging = false; });

  // 快捷键
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && !e.shiftKey && e.key === 'z') { e.preventDefault(); DrawingEngine.undo(); }
    if (e.ctrlKey && e.shiftKey && e.key === 'Z') { e.preventDefault(); DrawingEngine.redo(); }
    if (e.key === 'Delete') DrawingEngine.clearAll();
  });

  DrawingEngine.setTool('pen');
})();
