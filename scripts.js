let undoBtn = document.querySelector('.undo-button');
const clearButton = document.querySelector('#clear-button');
let colorPicker = document.querySelector('#color');
let color = colorPicker.value;
colorPicker.style.backgroundColor = 'black'
colorPicker.style.color = 'white'
const tool = document.querySelector('#tool-select');
let currentTool;
const gridNumber = document.querySelector('#grid-size');
const body = document.querySelector('body');
const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d', {willReadFrequently: true});
let isDrawing = false;
let index = -1;
let paths = [];
const ongoingTouches = [];
let startX, startY;
let currentX, currentY;
let elbowSequence;
let pieceLength;
let currentLine = { startX: 0, startY: 0, endX: 0, endY: 0, color: 'black', tool: tool.value };
let lines = []; // Array to store all drawn lines


function updateGridSize(number) {
  let gridNumber = document.querySelector('#grid-size');
  gridNumber.value = number;
  return number;
}



function updateGridButton(element) {
  if (lines.length !== 0) {
    element.innerText = 'Undo';
    element.style.backgroundColor = 'silver';
    element.style.display = 'block'
    gridNumber.style.display = 'none'
  } else {
    element.style.backgroundColor = '#F09904';
    element.innerText = 'Update Grid';
    element.style.display = 'none'
    gridNumber.style.display = 'block'
  }
};

function drawGrid(){
  ctx.lineWidth = 1;
  ctx.setLineDash([])
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.strokeStyle = 'lightgray';
  
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);

  }

  for (let i = 0; i < 6; i++){
    ctx.stroke()
  }
 
}

function setCanvasDimentions(x, y){
  canvas.width = x;
  canvas.height = y;
}

function startup() {
  let gridNumber = document.querySelector('#grid-size');
  gridSize = updateGridSize(parseInt(gridNumber.value));

  setCanvasDimentions(500,500)
  drawGrid();
  updateGridButton(undoBtn);

  window.chrome ? document.querySelector('.customer-details-body2').style.marginTop = '-16px' : document.querySelector('.customer-details-body2').style.marginTop = 'auto'
}

function updateColor(context) {
  let color = document.querySelector('#color').value;
  let colorPreview = document.querySelector('#color');
  const colorKey = {
    green: '#2efc05',
    black: 'black',
    cyan: 'cyan',
  }

  if (color === 'green') {
    context.strokeStyle = colorKey[color];
    context.fillStyle = colorKey[color];
    colorPreview.style.backgroundColor = colorKey[color];
    return 'green'
  }
  else if (color === 'black') {
    context.strokeStyle = colorKey[color];
    context.fillStyle = colorKey[color];
    colorPreview.style.backgroundColor = colorKey[color];
    colorPreview.style.color = 'white';
    return 'black'
  }
  else if (color === 'cyan') {
    context.strokeStyle = colorKey[color];
    context.fillStyle = colorKey[color];
    colorPreview.style.backgroundColor = colorKey[color];
    colorPreview.style.color = 'black';
    return 'cyan'
  }
  else {
    context.strokeStyle = color;
    context.fillStyle = color;
    colorPreview.style.backgroundColor = color;
    return color
  }
}

function setTool(tool){
  if (tool === 'gutter-w-screen'){
    context.globalCompositeOperation = 'source-over';
    ctx.setLineDash([4, 1])
    ctx.lineWidth = 4;
  } else if (tool === 'existing-gutter'){
    ctx.lineWidth = 2;
    ctx.setLineDash([2,2])
  } else if (tool === 'gutter'){
    ctx.lineWidth = 2
    ctx.setLineDash([])
  }
}

function drawAllLines() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawGrid()
  
  // Draw each saved line
  lines.forEach(({ startX, startY, endX, endY, color, tool }) => {
    drawLine(startX, startY, endX, endY, color, tool);
  });
  
  // Draw the current line while the user is dragging
  if (isDrawing) {
    const { startX, startY, endX, endY, color, tool } = currentLine;
    drawLine(startX, startY, endX, endY, color, tool);
  }
}

function drawLine(x1, y1, x2, y2, color, tool) {

  x1 = Math.round((x1 / gridSize)) * gridSize
  x2 = Math.round((x2 / gridSize)) * gridSize
  y1 = Math.round((y1 / gridSize)) * gridSize
  y2 = Math.round((y2 / gridSize)) * gridSize
  
  updateColor(ctx)

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  setTool(tool)
  ctx.stroke();
  ctx.closePath();
}

function setContext(){
  paths.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  index ++;
}

function handleDraw(event) {
  
  // startX = (event.pageX - canvas.offsetLeft);
  // startY = (event.pageY - canvas.offsetTop);
  // isDrawing = true;
  // let newX = Math.round(startX / gridSize) * gridSize;
  // let newY = Math.round(startY / gridSize) * gridSize;
  // updateColor(ctx);
  // ctx.beginPath();
  // ctx.moveTo(newX, newY);
  
    
    const { offsetX, offsetY } = event;
    currentLine = { 
      startX: offsetX, 
      startY: offsetY, 
      endX: offsetX, 
      endY: offsetY, 
      color: updateColor(ctx),
      tool: tool.value
    };
    isDrawing = true;
  ;

}

function drawHollowCircle(size){
  // the higher the size parameter, the smaller the circle
    startX = (event.pageX - canvas.offsetLeft);
    startY = (event.pageY - canvas.offsetTop);
    isDrawing = true;
    let newX = Math.round(startX / gridSize) * gridSize;
    let newY = Math.round(startY / gridSize) * gridSize;
    ctx.beginPath();
    ctx.setLineDash([]);
    updateColor(ctx);
    context.arc(newX, newY, gridSize / size, 0, 2 * Math.PI);
    context.lineWidth = 1;
    context.stroke();
}

function drawX(size){
  // the higher the size the smaller the x
    startX = (event.pageX - canvas.offsetLeft);
    startY = (event.pageY - canvas.offsetTop);
    isDrawing = true;
    let newX = Math.round(startX / gridSize) * gridSize;
    let newY = Math.round(startY / gridSize) * gridSize;
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(newX, newY);
    ctx.lineTo(newX + gridSize / size, newY + gridSize / size);
    ctx.moveTo(newX, newY);
    ctx.lineTo(newX - gridSize / size, newY + gridSize / size);
    ctx.moveTo(newX, newY);
    ctx.lineTo(newX - gridSize / size, newY - gridSize / size);
    ctx.moveTo(newX, newY);
    ctx.lineTo(newX + gridSize / size, newY - gridSize / size);
    updateColor(ctx);
    context.lineWidth = 2;
    context.stroke();
}

function drawFilledCircle(size){
  // the higher the size the smaller the x
    startX = (event.pageX - canvas.offsetLeft);
    startY = (event.pageY - canvas.offsetTop);
    isDrawing = true;
    let newX = Math.round(startX / gridSize) * gridSize;
    let newY = Math.round(startY / gridSize) * gridSize;
    ctx.beginPath();
    ctx.setLineDash([]);
    updateColor(ctx);
    ctx.moveTo(newX, newY);
    context.arc(newX, newY, gridSize / size, 0, 2 * Math.PI);
    context.fill();
}

canvas.addEventListener('pointerdown', function (event) {
  event.preventDefault();
  if (tool.value === 'gutter' || tool.value === 'existing-gutter' || tool.value === 'gutter-w-screen') {
    handleDraw(event);
  } else if (tool.value === 'drop') {
    drawHollowCircle(4)
  } else if (tool.value === 'downspout') {
    drawX(2.75);
  } else if (tool.value === 'valley-shield') {
    drawFilledCircle(4)
  } else if (tool.value === 'free-text') {
    startX = (event.pageX - canvas.offsetLeft);
    startY = (event.pageY - canvas.offsetTop);
    let userInput = prompt('Type in the elbow sequence or the length of the piece. (ex: AABA, 57")');
    ctx.font = '1000 12px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    index += 1;
    if (!userInput) {
      return
    } else {
      ctx.fillText(`${userInput}`, startX, startY);
      paths.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
      updateGridButton(undoBtn)
    }
  }
});

canvas.addEventListener('pointermove', function (event) {
  context = canvas.getContext('2d');
  if (isDrawing && tool.value === 'gutter') {
    ctx.setLineDash([])
    if (!isDrawing) return;

      const { offsetX, offsetY } = event;
      currentLine.endX = offsetX;
      currentLine.endY = offsetY;

      drawAllLines(); // Redraw all lines while dragging

  } else if (isDrawing && tool.value === 'gutter-w-screen') {
    // currentX = (event.pageX - canvas.offsetLeft);
    // currentY = (event.pageY - canvas.offsetTop);
    // let newX = Math.round(currentX / gridSize) * gridSize;
    // let newY = Math.round(currentY / gridSize) * gridSize;
    // context.lineTo(newX, newY);
      ctx.setLineDash([2,2])
    // context.stroke();
    // context.lineWidth = 1;
    // context.globalCompositeOperation = 'xor';
    // context.stroke();
    if (!isDrawing) return;

      const { offsetX, offsetY } = event;
      currentLine.endX = offsetX;
      currentLine.endY = offsetY;

      drawAllLines(); // Redraw all lines while dragging
      ctx.setLineDash([])
  } else if (isDrawing && tool.value === 'existing-gutter') {
    // context.globalCompositeOperation = 'source-over';
    // currentX = (event.pageX - canvas.offsetLeft);
    // currentY = (event.pageY - canvas.offsetTop);
    // let newX = Math.round(currentX / gridSize) * gridSize;
    // let newY = Math.round(currentY / gridSize) * gridSize;
    // context.setLineDash([2, 2]);
    // context.lineTo(newX, newY);
    // context.lineWidth = 2;
    // context.stroke();
    ctx.setLineDash([2,2])
    if (!isDrawing) return;

      const { offsetX, offsetY } = event;
      currentLine.endX = offsetX;
      currentLine.endY = offsetY;

      drawAllLines(); // Redraw all lines while dragging
  } 
  // else if (isDrawing && tool.value === 'flashing') {
  //   context.globalCompositeOperation = 'source-over';
  //   currentX = (event.pageX - canvas.offsetLeft);
  //   currentY = (event.pageY - canvas.offsetTop);
  //   let newX = Math.round(currentX / gridSize) * gridSize;
  //   let newY = Math.round(currentY / gridSize) * gridSize;
  //   context.setLineDash([]);
  //   context.lineTo(newX, newY);
  //   context.moveTo(newX + 4, newY - 4);
  //   context.lineWidth = 2;
  //   context.stroke();
  // } 
  // else if (isDrawing && tool.value === 'fascia-repair') {
  //   context.globalCompositeOperation = 'source-over';
  //   currentX = (event.pageX - canvas.offsetLeft);
  //   currentY = (event.pageY - canvas.offsetTop);
  //   let newX = Math.round(currentX / gridSize) * gridSize;
  //   let newY = Math.round(currentY / gridSize) * gridSize;
  //   context.setLineDash([]);
  //   context.lineTo(newX, newY);
  //   context.moveTo(newX - 5, newY + 5);
  //   context.lineWidth = 2;
  //   context.stroke();
  // }
});

canvas.addEventListener('pointerup', function (event) {
  // event.preventDefault();
  // isDrawing = false;
  // index += 1;
  // ctx.moveTo(currentX, currentY);
  // ctx.lineTo(currentX, currentY);
  // ctx.stroke();
  // ctx.closePath();
  // updateGridButton(undoBtn);
  if (isDrawing) {
    lines.push({ ...currentLine }); // Save the current line to the lines array
    updateGridButton(undoBtn)
    setContext()
  }
  isDrawing = false;
});


function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines = []
  paths = [];
  index = -1;
  updateGridButton(undoBtn);
  colorPicker.value = 'black'
  colorPicker.style.backgroundColor = 'black'
  colorPicker.style.color = 'white'
  startup();
}

function undo() {
  if (index <= 0) {
    clear();
  } else {
    index -= 1;
    paths.pop();
    lines.pop();
    ctx.putImageData(paths[index], 0, 0);
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  log('touchcancel.');
  const touches = evt.changedTouches;
  
  for (let i = 0; i < touches.length; i++) {
    let idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1);  // remove it; we're done
  }
}

function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[i].identifier;
    
    if (id === idToFind) {
      return i;
    }
  }
  return -1;   
}

function finish() {
  window.onbeforeprint = (event) => {
    toolsBar = document.querySelector('.tools-bar');
    toolsBar.style.display = 'none';
    legendPic = document.querySelector('.legend-pic');
  };
  window.print();
}

canvas.addEventListener('touchcancel', handleCancel);
clearButton.addEventListener('click', clear);
document.addEventListener("DOMContentLoaded", startup);

document.body.addEventListener("pointerdown", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, { passive: false });

document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, { passive: false });

document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, { passive: false });

window.onafterprint = (event) => {
  toolsBar = document.querySelector('.tools-bar');
  toolsBar.style.display = 'flex';
}
