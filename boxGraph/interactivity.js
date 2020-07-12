// Functions to create interactivity (drag, key presses)
const canvas = document.getElementById('boxGraph');
const ctx = canvas.getContext('2d');

// Globals
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Interactivity configurations
// Note: Buffer is the extra space around the line that will count as "interacting"
const LEFT_BAR_LINE_BUFFER = 10;
const RIGHT_BAR_LINE_BUFFER = 10;
const MIDDLE_BAR_LINE_BUFFER = 10;

const DEFAULT_CURSOR_STYLE = 'auto';
const VERTICAL_DRAG_CURSOR_STYLE = 'row-resize';
const HORIZONTAL_DRAG_CURSOR_STYLE = 'col-resize';

const ROUND_TO_DECIMAL_POINT = 3;

// Description: Changes the cursor to appropriate style depending on where mouse is
// Input: Event call, Y left bar coordinate, Y right bar coordinate, X middle line
export function handleMouseCursor(event, leftY, rightY, middleX) {
    let mouseX = event.offsetX
    let mouseY = event.offsetY;

    let isMouseInLeftBarWidth = mouseX <= (middleX + LEFT_BAR_LINE_BUFFER);
    let isMouseInLeftBarHeight = mouseY >= (leftY - LEFT_BAR_LINE_BUFFER) && mouseY <= (leftY + LEFT_BAR_LINE_BUFFER);

    let isMouseInRightBarWidth = mouseX >= (middleX + RIGHT_BAR_LINE_BUFFER);
    let isMouseInRightBarHeight = mouseY >= (rightY - RIGHT_BAR_LINE_BUFFER) && mouseY <= (rightY + RIGHT_BAR_LINE_BUFFER);

    let isMouseInMiddleBarWidth = mouseX >= (middleX - MIDDLE_BAR_LINE_BUFFER) && mouseX <= (middleX + MIDDLE_BAR_LINE_BUFFER);

    if ( isMouseInMiddleBarWidth ) {
        canvas.style.cursor = HORIZONTAL_DRAG_CURSOR_STYLE;
    }
    else if ( isMouseInLeftBarWidth && isMouseInLeftBarHeight) {
        canvas.style.cursor = VERTICAL_DRAG_CURSOR_STYLE;
    }
    else if ( isMouseInRightBarWidth && isMouseInRightBarHeight) {
        canvas.style.cursor = VERTICAL_DRAG_CURSOR_STYLE;
    }
    else {
        canvas.style.cursor = DEFAULT_CURSOR_STYLE;
    }
}

// Description: Handle the left mouse button down
// Input: Mouse event, boolean for left bar, boolean for right bar, boolean for middleDrag
export function handleLmbDown(event, leftBarDrag, rightBarDrag, middleLineDrag) {
    // Check if any of the drag booleans need to be changed
}

// Description: Handle the vertical bar drags when mouse moves
// Input: Event
// Output: New probability value given the mouse event value
export function handleVerticalBarDrag(event) {
    let mouseY = event.offsetY;
    // Calculate the closest probability value to this Y
    let probability = _convertYCoordinateToPercentage(mouseY);
    return probability;
}

// Description: Handle the rightBarDrag when mouse moves
// Input: Event
// Output: New P(E|Not-H) value
export function handleHorizontalLineDrag(event) {
    let mouseX = event.offsetX;
    
    // Calculate the closest probability value to this X
    let probability = _convertXCoordinateToPercentage(mouseX);
    return probability;
}

// Description: Checks if the mouse event is interacting with the middle line
// Input: Mouse event, middle X coordinate
// Output: Boolean 
export function isMouseOnMiddleLine(event, middleX) {
    let mouseX = event.offsetX;

    let isMouseInMiddleBarWidth = mouseX >= (middleX - MIDDLE_BAR_LINE_BUFFER) && mouseX <= (middleX + MIDDLE_BAR_LINE_BUFFER);
    return isMouseInMiddleBarWidth;
}

// Description: Checks if the mouse event is interacting with the left bar line
// Input: Mouse event, left bar y coordinate, middle X coordinate
// Output: Boolean 
export function isMouseOnLeftBarLine(event, leftY, middleX) {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;

    let isMouseInLeftBarWidth = mouseX <= (middleX + LEFT_BAR_LINE_BUFFER);
    let isMouseInLeftBarHeight = mouseY >= (leftY - LEFT_BAR_LINE_BUFFER) && mouseY <= (leftY + LEFT_BAR_LINE_BUFFER);

    if (isMouseInLeftBarWidth && isMouseInLeftBarHeight) {
        return true;
    }
    else {
        return false;
    }
}

// Description: Checks if the mouse event is interacting with the right bar line
// Input: Mouse event, right bar y coordinate, middle X coordinate
// Output: Boolean 
export function isMouseOnRightBarLine(event, rightY, middleX) {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;

    let isMouseInRightBarWidth = mouseX >= (middleX + RIGHT_BAR_LINE_BUFFER);
    let isMouseInRightBarHeight = mouseY >= (rightY - RIGHT_BAR_LINE_BUFFER) && mouseY <= (rightY + RIGHT_BAR_LINE_BUFFER);

    if (isMouseInRightBarWidth && isMouseInRightBarHeight) {
        return true;
    }
    else {
        return false;
    }
}

// Description: Calculate the nearest floating point value closest to the Y coordinate
function _convertYCoordinateToPercentage(yCoordinate) {
    let percentage = yCoordinate/CANVAS_HEIGHT;
    percentage = 1-percentage;
    return percentage.toFixed(ROUND_TO_DECIMAL_POINT);
}

// Description: Calculate the nearest floating point value closest to the X coordinate
function _convertXCoordinateToPercentage(xCoordinate) {
    let percentage = xCoordinate/CANVAS_WIDTH;
    percentage = percentage;
    return percentage.toFixed(ROUND_TO_DECIMAL_POINT);
}
