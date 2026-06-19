DrawingEngine.registerTool('pen', (() => {
  let points = [];
  function onPointerDown(ctx, pos, color, size) {
    points = [pos];
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = color; ctx.lineWidth = size;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha = 1;
  }
  function onPointerMove(ctx, pos, color, size) {
    points.push(pos);
    ctx.lineTo(pos.x, pos.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
  }
  function onPointerUp(ctx, pos, color, size) {
    if (points.length === 0) return null;
    const action = { tool: 'pen', points: [...points], color, size };
    points = [];
    return action;
  }
  function render(ctx, action) {
    if (!action.points || action.points.length === 0) return;
    ctx.beginPath(); ctx.strokeStyle = action.color; ctx.lineWidth = action.size;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha = 1;
    ctx.moveTo(action.points[0].x, action.points[0].y);
    for (let i = 1; i < action.points.length; i++) ctx.lineTo(action.points[i].x, action.points[i].y);
    ctx.stroke();
  }
  return { onPointerDown, onPointerMove, onPointerUp, render };
})());
