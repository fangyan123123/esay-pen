const DrawingEngine = (() => {
  const canvas = document.getElementById('drawing-canvas');
  const ctx = canvas.getContext('2d');
  const undoStack = [];
  const redoStack = [];
  let currentTool = null;
  let currentColor = '#FF0000';
  let currentSize = 5;
  let isDrawing = false;
  const tools = {};

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawAll();
  }

  function redrawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const action of undoStack) {
      if (action.tool && tools[action.tool]) {
        tools[action.tool].render(ctx, action);
      }
    }
  }

  function pushAction(action) {
    undoStack.push(action);
    redoStack.length = 0;
  }

  function undo() {
    if (undoStack.length === 0) return;
    redoStack.push(undoStack.pop());
    redrawAll();
  }

  function redo() {
    if (redoStack.length === 0) return;
    undoStack.push(redoStack.pop());
    redrawAll();
  }

  function clearAll() {
    undoStack.length = 0;
    redoStack.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function registerTool(name, handler) { tools[name] = handler; }
  function setTool(name) { currentTool = name; }
  function setColor(color) { currentColor = color; }
  function setSize(size) { currentSize = size; }

  function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e) {
    if (!currentTool || !tools[currentTool]) return;
    isDrawing = true;
    tools[currentTool].onPointerDown(ctx, getPosition(e), currentColor, currentSize);
  }

  function handlePointerMove(e) {
    if (!isDrawing || !currentTool || !tools[currentTool]) return;
    tools[currentTool].onPointerMove(ctx, getPosition(e), currentColor, currentSize);
  }

  function handlePointerUp(e) {
    if (!isDrawing || !currentTool || !tools[currentTool]) return;
    isDrawing = false;
    const action = tools[currentTool].onPointerUp(ctx, getPosition(e), currentColor, currentSize);
    if (action) pushAction(action);
  }

  canvas.addEventListener('mousedown', handlePointerDown);
  canvas.addEventListener('mousemove', handlePointerMove);
  canvas.addEventListener('mouseup', handlePointerUp);
  canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
  canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
  canvas.addEventListener('touchend', handlePointerUp);
  window.addEventListener('resize', resizeCanvas);

  // 每次进入画笔模式时清空画布，确保是全新面板
  window.electronAPI.onModeChanged((isDrawing) => {
    if (isDrawing) clearAll();
  });

  resizeCanvas();

  return {
    registerTool, setTool, setColor, setSize,
    undo, redo, clearAll, redrawAll, pushAction,
    getCanvas: () => canvas,
    getCtx: () => ctx,
    getState: () => ({ currentTool, currentColor, currentSize }),
    removeAction: (predicate) => {
      const index = undoStack.findIndex(predicate);
      if (index !== -1) { undoStack.splice(index, 1); redrawAll(); return true; }
      return false;
    },
    getUndoStack: () => [...undoStack]
  };
})();
