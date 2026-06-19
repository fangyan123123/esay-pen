DrawingEngine.registerTool('eraser', (() => {
  const ERASER_RADIUS = 20;

  function isPointNearAction(pos, action) {
    const r = ERASER_RADIUS;
    switch (action.tool) {
      case 'pen': case 'highlighter':
        return action.points.some(p => Math.hypot(p.x - pos.x, p.y - pos.y) < r);
      case 'rect':
        return pos.x >= Math.min(action.start.x, action.end.x) - r && pos.x <= Math.max(action.start.x, action.end.x) + r &&
               pos.y >= Math.min(action.start.y, action.end.y) - r && pos.y <= Math.max(action.start.y, action.end.y) + r;
      case 'circle': {
        const cx = (action.start.x + action.end.x) / 2, cy = (action.start.y + action.end.y) / 2;
        const rx = Math.abs(action.end.x - action.start.x) / 2 + r, ry = Math.abs(action.end.y - action.start.y) / 2 + r;
        if (rx === 0 || ry === 0) return false;
        const dx = (pos.x - cx) / rx, dy = (pos.y - cy) / ry;
        return (dx * dx + dy * dy) <= 1;
      }
      case 'line': case 'arrow': {
        const dx = action.end.x - action.start.x, dy = action.end.y - action.start.y, len2 = dx * dx + dy * dy;
        if (len2 === 0) return Math.hypot(pos.x - action.start.x, pos.y - action.start.y) < r;
        let t = ((pos.x - action.start.x) * dx + (pos.y - action.start.y) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(pos.x - (action.start.x + t * dx), pos.y - (action.start.y + t * dy)) < r;
      }
      case 'text':
        return Math.abs(pos.x - action.pos.x) < 100 && Math.abs(pos.y - action.pos.y) < action.fontSize;
      default: return false;
    }
  }

  function eraseAt(pos) {
    const stack = DrawingEngine.getUndoStack();
    for (let i = stack.length - 1; i >= 0; i--) {
      if (isPointNearAction(pos, stack[i])) {
        // 使用 predicate 匹配 action 内容而非索引，避免副本索引与原栈不同步
        DrawingEngine.removeAction((a) => a === stack[i]);
        break;
      }
    }
  }

  function onPointerDown(ctx, pos) { eraseAt(pos); }
  function onPointerMove(ctx, pos) { eraseAt(pos); }
  function onPointerUp() { return null; }
  function render() {}

  return { onPointerDown, onPointerMove, onPointerUp, render };
})());
