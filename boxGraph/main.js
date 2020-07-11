// Main functions to create the box graph and update it with percentage

// Globals
const canvas = document.getElementById('boxGraph');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Configuration constants
const CANVAS_BORDER_THICKNESS = 8;
const CANVAS_BORDER_COLOR = '#000000';

const LEFT_BAR_COLOR = '#90FF93';
const RIGHT_BAR_COLOR = '#90B1FF';

const LEFT_BAR_LINE_THICKNESS = 4;
const RIGHT_BAR_LINE_THICKNESS = 4;

const LEFT_BAR_LINE_COLOR = '#000000'
const RIGHT_BAR_LINE_COLOR = '#000000'

const MIDDLE_BAR_LINE_THICKNESS = 4;
const MIDDLE_BAR_LINE_COLOR = '#B22222';


// Main update function
function update() {
    clear();
    
    drawBoxGraph();
    drawBorder();
    
    requestAnimationFrame(update);
}

// Description: Clears the boxGraph of drawings
function clear() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Description: Draws a border around the canvas
function drawBorder() {
    ctx.lineWidth = CANVAS_BORDER_THICKNESS;
    ctx.strokeStyle = CANVAS_BORDER_COLOR;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Description: Draws the box graph
// Input: P(E|H) floating point value, P(E|Not-H) floating point value, P(H) floating point value
// Example: drawBoxGraph(0.32, 0.65, 0.64) draws a graph with left bar 32% height, right bar 65% height, and middle divider 64% to the right
function drawBoxGraph(pEH=0.5, pENotH=0.5, pH=0.5) {
    // Draw the left bar
    let leftBarHeight = pEH * CANVAS_HEIGHT;
    let leftBarWidth = pH * CANVAS_WIDTH;
    
    ctx.fillStyle = LEFT_BAR_COLOR;
    ctx.fillRect(0, leftBarHeight, leftBarWidth, CANVAS_HEIGHT);
    
    // Draw the left bar height line
    ctx.strokeStyle = LEFT_BAR_LINE_COLOR;
    ctx.lineWidth = LEFT_BAR_LINE_THICKNESS;
    ctx.beginPath();
    ctx.moveTo(0, leftBarHeight);
    ctx.lineTo(leftBarWidth, leftBarHeight);
    ctx.stroke();
    
    // Draw the right bar
    let rightBarHeight = pENotH * CANVAS_HEIGHT;
    let rightBarWidth = pH * CANVAS_WIDTH;
    
    ctx.fillStyle = RIGHT_BAR_COLOR;
    ctx.fillRect(rightBarWidth, rightBarHeight, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw the right bar height line
    ctx.strokeStyle = RIGHT_BAR_LINE_COLOR;
    ctx.lineWidth = RIGHT_BAR_LINE_THICKNESS;
    ctx.beginPath();
    ctx.moveTo(rightBarWidth, rightBarHeight);
    ctx.lineTo(CANVAS_WIDTH, rightBarHeight);
    ctx.stroke();
    
    // TODO: Draw the middle line
    let middleLineXCoordinate = pH * CANVAS_WIDTH;
    ctx.strokeStyle = MIDDLE_BAR_LINE_COLOR;
    ctx.lineWidth = MIDDLE_BAR_LINE_THICKNESS;
    ctx.beginPath();
    ctx.moveTo(middleLineXCoordinate, 0);
    ctx.lineTo(middleLineXCoordinate, CANVAS_HEIGHT);
    ctx.stroke();

}

update();



