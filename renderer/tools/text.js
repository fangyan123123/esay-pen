DrawingEngine.registerTool('text', (() => {
  const textInput = document.getElementById('text-input');
  let clickPos = null;

  function onPointerDown(ctx, pos, color, size) {
    // 先保存之前未确认的文字
    confirmText();
    clickPos = pos;
    confirmed = false;
    textInput.style.display = 'block';
    textInput.style.left = pos.x + 'px';
    textInput.style.top = pos.y + 'px';
    textInput.style.color = color;
    textInput.style.fontSize = (size * 4 + 12) + 'px';
    textInput.value = '';
    setTimeout(() => textInput.focus(), 0);
  }

  function onPointerMove() {}
  function onPointerUp() { return null; }

  let confirmed = false;
  function confirmText() {
    if (confirmed) return;
    confirmed = true;
    if (!clickPos || !textInput.value.trim()) {
      textInput.style.display = 'none'; clickPos = null; return;
    }
    const ctx = DrawingEngine.getCtx();
    const state = DrawingEngine.getState();
    const fontSize = state.currentSize * 4 + 12;
    ctx.font = fontSize + 'px sans-serif';
    ctx.fillStyle = state.currentColor;
    ctx.globalAlpha = 1;
    ctx.fillText(textInput.value, clickPos.x, clickPos.y + fontSize);
    DrawingEngine.pushAction({ tool: 'text', text: textInput.value, pos: {...clickPos}, color: state.currentColor, fontSize });
    textInput.style.display = 'none'; textInput.value = ''; clickPos = null;
  }

  textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmText();
    if (e.key === 'Escape') { confirmed = true; textInput.style.display = 'none'; textInput.value = ''; clickPos = null; }
    e.stopPropagation();
  });
  textInput.addEventListener('mousedown', (e) => e.stopPropagation());
  textInput.addEventListener('blur', confirmText);

  function render(ctx, action) {
    ctx.font = action.fontSize + 'px sans-serif';
    ctx.fillStyle = action.color; ctx.globalAlpha = 1;
    ctx.fillText(action.text, action.pos.x, action.pos.y + action.fontSize);
  }

  return { onPointerDown, onPointerMove, onPointerUp, render };
})());
