// Main functions to create the box graph and update it with percentage
import * as interactivity from './interactivity.js';

// Globals
const canvas = document.getElementById('boxGraph');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Probabilities
var pEH = 0.5;
var pENotH = 0.5;
var pH = 0.5;

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

// Interactivity globals
var leftY = undefined; 
var rightY = undefined; 
var middleX = undefined; 

var leftBarDrag = false;
var rightBarDrag = false;
var middleLineDrag = false;

// Main update function
function update() {
    clear();
    // interactivity.test();
    drawBoxGraph(pEH, pENotH, pH);
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
    // Note: When using the percentages and using it in the canvas, it must be inverted
    // Draw the left bar
    let leftBarHeight = (1-pEH) * CANVAS_HEIGHT;
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
    leftY = leftBarHeight;
    
    // Draw the right bar
    let rightBarHeight = (1-pENotH) * CANVAS_HEIGHT;
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
    rightY = rightBarHeight;
    
    // TODO: Draw the middle line
    let middleLineX = pH * CANVAS_WIDTH;
    ctx.strokeStyle = MIDDLE_BAR_LINE_COLOR;
    ctx.lineWidth = MIDDLE_BAR_LINE_THICKNESS;
    ctx.beginPath();
    ctx.moveTo(middleLineX, 0);
    ctx.lineTo(middleLineX, CANVAS_HEIGHT);
    ctx.stroke();
    middleX = middleLineX;
}

// Description: Resets the drag booleans
function resetDragState() {
    leftBarDrag = false;
    rightBarDrag = false;
    middleLineDrag = false;
}

canvas.addEventListener('mousemove', function() {
    // Handle changing the cursor
    interactivity.handleMouseCursor(event, leftY, rightY, middleX);
    if (leftBarDrag) {
        pEH = interactivity.handleVerticalBarDrag(event);
        drawBoxGraph(pEH, pENotH, pH);
    }
    if (rightBarDrag) {
        pENotH = interactivity.handleVerticalBarDrag(event);
        drawBoxGraph(pEH, pENotH, pH);
    }
    if (middleLineDrag) {
        pH = interactivity.handleHorizontalLineDrag(event);
        drawBoxGraph(pEH, pENotH, pH);
    }
});

canvas.addEventListener('mousedown', function() {
    // Update the interactivity booleans
    if (interactivity.isMouseOnMiddleLine(event, middleX)) {
        middleLineDrag = true;
    }
    else if (interactivity.isMouseOnLeftBarLine(event, leftY, middleX)) {
        leftBarDrag = true;
    }
    else if (interactivity.isMouseOnRightBarLine(event, rightY, middleX)) {
        rightBarDrag = true;
    }
});

document.addEventListener('mouseup', resetDragState);

update();


