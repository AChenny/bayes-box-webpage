// Main functions to create the box graph and update it with percentage

// Globals
const canvas = document.getElementById('boxGraph');
const ctx = canvas.getContext('2d');

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var canvasBorderThickness = 5;


// Main update function
function update() {
    clear();
    
    drawBorder()
    
    requestAnimationFrame(update);
}

function clear() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

// Description: Draws a border around the canvas
function drawBorder() {
    ctx.lineWidth = canvasBorderThickness;
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
}

update();



