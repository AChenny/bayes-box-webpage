// Main functions to create the box graph and update it with percentage
import * as interactivity from './interactivity.js';
import * as rulers from './rulers.js';
import { updateValues } from '../script.js';

// Globals
const canvas = document.getElementById('boxGraph');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Probabilities
var pEH = 0.500;
var pENotH = 0.200;
var pH = 0.400;

// Configuration constants
const CANVAS_BORDER_THICKNESS = 8;
const CANVAS_BORDER_COLOR = '#000000';

const LEFT_BAR_COLOR = '#90FF93';
const RIGHT_BAR_COLOR = '#9090FF';
const LEFT_BAR_COLOR_DESATURATED = '#1aff93';
const RIGHT_BAR_COLOR_DESATURATED = '#c890ff';

const LEFT_BAR_LINE_THICKNESS = 4;
const RIGHT_BAR_LINE_THICKNESS = 4;
const NEGATIVE_RESULTS_BAR_LINE_THICKNESS = 6;

const LEFT_BAR_LINE_COLOR = '#000000'
const RIGHT_BAR_LINE_COLOR = '#000000'
const DESATURATED_BAR_LINE_COLOR = '#A9A9A9'
const NEGATIVE_RESULTS_BAR_LINE_COLOR = '#000000'

const MIDDLE_BAR_LINE_THICKNESS = 4;
const MIDDLE_BAR_LINE_COLOR = '#B22222';

const BOX_FONT_DEFAULT_STYLE = 'Verdana';
const BOX_FONT_DEFAULT_WEIGHT = 'bolder';

const LEFT_BOX_FONT_MAX_SIZE = 22; // In pt font
const RIGHT_BOX_FONT_MAX_SIZE = 18; // In pt font
const BOX_FONT_DEFAULT_COLOR = '#000000';
const BOX_FONT_BUFFER = 70; // In pixels

var estimatorMode = false; // Boolean, flag to draw or not draw the probabilities
var negativeResultsMode = false; // Flag to check for negative results mode

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
    drawBoxGraph(pEH, pENotH, pH);
    rulers.updateRulers(pEH, pENotH, pH);
    if (!estimatorMode && !negativeResultsMode) {
        drawBoxText(pEH, pENotH, pH);
    }
    drawBorder();
    
    // Updating this should update all the labels on main script
    updateValues(pEH, pENotH, pH);
    
    requestAnimationFrame(update);
}

// Description: Updates the probability values in this scope
// Input: Probability values in float <1;
// Example: updateBoxGraphValues(0.500, 0.522, 1.000);
export function updateBoxGraphValues(_pEH, _pENotH, _pH) {
    pEH = _pEH;
    pENotH = _pENotH;
    pH = _pH;
}

// Description: Sets the estimator mode flag on or off as an export
// Input: Boolean
// Output: None
// Example: setEstimatorMode(false)
export function setEstimatorModeBoxGraph(flag) {
    estimatorMode = flag;
}

// Description: Sets the negative results mode flag on or off as an exported function
// Input: Boolean
// Output: None
// Example: setNegativeResultsModeBoxGraph(false)
export function setNegativeResultsModeBoxGraph(flag) {
    negativeResultsMode = flag;
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
    
    if (negativeResultsMode) {
        ctx.fillStyle = LEFT_BAR_COLOR_DESATURATED;
    }
    else {
        ctx.fillStyle = LEFT_BAR_COLOR;
    }
    ctx.fillRect(0, leftBarHeight, leftBarWidth, CANVAS_HEIGHT);
    
    // Draw the left bar height line
    if (negativeResultsMode) {
        ctx.strokeStyle = DESATURATED_BAR_LINE_COLOR;
    }
    else {
        ctx.strokeStyle = LEFT_BAR_LINE_COLOR;
    }
    ctx.lineWidth = LEFT_BAR_LINE_THICKNESS;
    ctx.beginPath();
    ctx.moveTo(0, leftBarHeight);
    ctx.lineTo(leftBarWidth, leftBarHeight);
    ctx.stroke();
    leftY = leftBarHeight;
    
    // Draw the right bar
    let rightBarHeight = (1-pENotH) * CANVAS_HEIGHT;
    let rightBarWidth = pH * CANVAS_WIDTH;
    
    if (negativeResultsMode) {
        ctx.fillStyle = RIGHT_BAR_COLOR_DESATURATED;
    }
    else {
        ctx.fillStyle = RIGHT_BAR_COLOR;
    }
    ctx.fillRect(rightBarWidth, rightBarHeight, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw the right bar height line
    if (negativeResultsMode) {
        ctx.strokeStyle = DESATURATED_BAR_LINE_COLOR;
    }
    else {
        ctx.strokeStyle = RIGHT_BAR_LINE_COLOR;
    }
    ctx.lineWidth = RIGHT_BAR_LINE_THICKNESS;
    ctx.beginPath();
    ctx.moveTo(rightBarWidth, rightBarHeight);
    ctx.lineTo(CANVAS_WIDTH, rightBarHeight);
    ctx.stroke();
    rightY = rightBarHeight;
    
    // Draw the middle line
    let middleLineX = pH * CANVAS_WIDTH;
    ctx.strokeStyle = MIDDLE_BAR_LINE_COLOR;
    ctx.lineWidth = MIDDLE_BAR_LINE_THICKNESS;
    ctx.beginPath();
    ctx.moveTo(middleLineX, 0);
    ctx.lineTo(middleLineX, CANVAS_HEIGHT);
    ctx.stroke();
    middleX = middleLineX;

    // Negative results border
    if (negativeResultsMode) {
        ctx.strokeStyle = NEGATIVE_RESULTS_BAR_LINE_COLOR;
        ctx.lineWidth = NEGATIVE_RESULTS_BAR_LINE_THICKNESS;
        ctx.beginPath();
        ctx.rect(0, 0, middleX-MIDDLE_BAR_LINE_THICKNESS, leftBarHeight);
        ctx.stroke();

        // Ruler changes
    }
}

// Description: Draws the graph percentages inside the bar graphs
// Input: Input: P(E|H) floating point value, P(E|Not-H) floating point value, P(H) floating point value
function drawBoxText(pEH=0.5, pENotH=0.5, pH=0.5) {
    let pHE = ((pEH * pH)/((pEH * pH) + (pENotH * (1 - pH)))).toFixed(3);
    
    let leftBarFontSize = LEFT_BOX_FONT_MAX_SIZE;
    let rightBarFontSize =  RIGHT_BOX_FONT_MAX_SIZE;
    // Check left bar size
    if (pEH < 0.15 || pH < 0.15) {
        // Take the smaller size font and set it as that
        let percentageFont = Math.min((pEH * 6.66), (pH * 6.66));
        leftBarFontSize = (percentageFont * LEFT_BOX_FONT_MAX_SIZE).toFixed(0);
    } 
    if (pENotH < 0.15 || pH > 0.85) {
        // Take the smaller size font and set it as that
        let percentageFont = Math.min((pENotH * 6.66), ((1-pH) * 6.66));
        rightBarFontSize = (percentageFont * RIGHT_BOX_FONT_MAX_SIZE).toFixed(0);
    }
    
    // Add the text to the middle of the boxes
    let leftBarTextCoordsX = (((middleX-BOX_FONT_BUFFER) / 2)).toFixed(0);
    let leftBarTextCoordsY = ((CANVAS_HEIGHT + leftY) / 2).toFixed(0);
    ctx.fillStyle = BOX_FONT_DEFAULT_COLOR;
    ctx.font = BOX_FONT_DEFAULT_WEIGHT + ' ' + leftBarFontSize + 'pt ' +  BOX_FONT_DEFAULT_STYLE;
    ctx.fillText(pHE, leftBarTextCoordsX, leftBarTextCoordsY);

    let rightBarTextCoordsX = (((middleX + CANVAS_WIDTH) - BOX_FONT_BUFFER)/2).toFixed(0);
    let rightBarTextCoordsY = ((CANVAS_HEIGHT + rightY) / 2).toFixed(0);
    ctx.fillStyle = BOX_FONT_DEFAULT_COLOR;
    ctx.font = rightBarFontSize + 'pt ' + BOX_FONT_DEFAULT_STYLE + ' '; 
    ctx.fillText((1-pHE).toFixed(3), rightBarTextCoordsX, rightBarTextCoordsY);
}

// Description: Resets the drag booleans
function resetDragState() {
    leftBarDrag = false;
    rightBarDrag = false;
    middleLineDrag = false;
}

// Description: Flips the rulers to positive results mode or negative results mode
// Input: Boolean
// Output: None
export function setNegativeResultsRuler(flag) {
    // Negative results mode is on, set the rulers to P(H|E)
    if (flag) {
        // Hide the positive rulers
        $('#verticalRulerLeftBottom').css('visibility', 'hidden');
        $('#verticalRulerRightBottom').css('visibility', 'hidden');

        // Show the negative rulers
        $('#verticalRulerLeftTop').css('visibility', 'visible');
        $('#verticalRulerRightTop').css('visibility', 'visible');


    }
    else {
        // Hide the negative rulers
        $('#verticalRulerLeftTop').css('visibility', 'hidden');
        $('#verticalRulerRightTop').css('visibility', 'hidden');
        
        // Show the positive rulers
        $('#verticalRulerLeftBottom').css('visibility', 'visible');
        $('#verticalRulerRightBottom').css('visibility', 'visible');
    }
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



