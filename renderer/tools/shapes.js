// 矩形
DrawingEngine.registerTool('rect', (() => {
  let startPos = null;
  function onPointerDown(ctx, pos, color, size) { startPos = pos; }
  function onPointerMove(ctx, pos, color, size) {
    DrawingEngine.redrawAll();
    ctx.strokeStyle = color; ctx.lineWidth = size; ctx.globalAlpha = 1;
    ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
  }
  function onPointerUp(ctx, pos, color, size) {
    DrawingEngine.redrawAll();
    ctx.strokeStyle = color; ctx.lineWidth = size; ctx.globalAlpha = 1;
    ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
    const action = { tool: 'rect', start: {...startPos}, end: {...pos}, color, size };
    startPos = null;
    return action;
  }
  function render(ctx, action) {
    ctx.strokeStyle = action.color; ctx.lineWidth = action.size; ctx.globalAlpha = 1;
    ctx.strokeRect(action.start.x, action.start.y, action.end.x - action.start.x, action.end.y - action.start.y);
  }
  return { onPointerDown, onPointerMove, onPointerUp, render };
})());

// 圆形
DrawingEngine.registerTool('circle', (() => {
  let startPos = null;
  function onPointerDown(ctx, pos, color, size) { startPos = pos; }
  function onPointerMove(ctx, pos, color, size) {
    DrawingEngine.redrawAll();
    const rx = Math.abs(pos.x - startPos.x) / 2, ry = Math.abs(pos.y - startPos.y) / 2;
    const cx = (startPos.x + pos.x) / 2, cy = (startPos.y + pos.y) / 2;
    ctx.strokeStyle = color; ctx.lineWidth = size; ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
  }
  function onPointerUp(ctx, pos, color, size) {
    DrawingEngine.redrawAll();
    const rx = Math.abs(pos.x - startPos.x) / 2, ry = Math.abs(pos.y - startPos.y) / 2;
    const cx = (startPos.x + pos.x) / 2, cy = (startPos.y + pos.y) / 2;
    ctx.strokeStyle = color; ctx.lineWidth = size; ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
    const action = { tool: 'circle', start: {...startPos}, end: {...pos}, color, size };
    startPos = null;
    return action;
  }
  function render(ctx, action) {
    const rx = Math.abs(action.end.x - action.start.x) / 2, ry = Math.abs(action.end.y - action.start.y) / 2;
    const cx = (action.start.x + action.end.x) / 2, cy = (action.start.y + action.end.y) / 2;
    ctx.strokeStyle = action.color; ctx.lineWidth = action.size; ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
  }
  return { onPointerDown, onPointerMove, onPointerUp, render };
})());

// 直线
DrawingEngine.registerTool('line', (() => {
  let startPos = null;
  function onPointerDown(ctx, pos, color, size) { startPos = pos; }
  function onPointerMove(ctx, pos, color, size) {
    DrawingEngine.redrawAll();
    ctx.strokeStyle = color; ctx.lineWidth = size; ctx.lineCap = 'round'; ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(startPos.x, startPos.y); ctx.lineTo(pos.x, pos.y); ctx.stroke();
  }
  function onPointerUp(ctx, pos, color, size) {
    DrawingEngine.redrawAll();
    ctx.strokeStyle = color; ctx.lineWidth = size; ctx.lineCap = 'round'; ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(startPos.x, startPos.y); ctx.lineTo(pos.x, pos.y); ctx.stroke();
    const action = { tool: 'line', start: {...startPos}, end: {...pos}, color, size };
    startPos = null;
    return action;
  }
  function render(ctx, action) {
    ctx.strokeStyle = action.color; ctx.lineWidth = action.size; ctx.lineCap = 'round'; ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(action.start.x, action.start.y); ctx.lineTo(action.end.x, action.end.y); ctx.stroke();
  }
  return { onPointerDown, onPointerMove, onPointerUp, render };
})());

// 箭头
DrawingEngine.registerTool('arrow', (() => {
  let startPos = null;
  function drawArrow(ctx, from, to, color, size) {
    const headLen = size * 5, dx = to.x - from.x, dy = to.y - from.y, angle = Math.atan2(dy, dx);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = size; ctx.lineCap = 'round'; ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headLen * Math.cos(angle - Math.PI / 6), to.y - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(to.x - headLen * Math.cos(angle + Math.PI / 6), to.y - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath(); ctx.fill();
  }
  function onPointerDown(ctx, pos, color, size) { startPos = pos; }
  function onPointerMove(ctx, pos, color, size) { DrawingEngine.redrawAll(); drawArrow(ctx, startPos, pos, color, size); }
  function onPointerUp(ctx, pos, color, size) {
    DrawingEngine.redrawAll(); drawArrow(ctx, startPos, pos, color, size);
    const action = { tool: 'arrow', start: {...startPos}, end: {...pos}, color, size };
    startPos = null;
    return action;
  }
  function render(ctx, action) { drawArrow(ctx, action.start, action.end, action.color, action.size); }
  return { onPointerDown, onPointerMove, onPointerUp, render };
})());
