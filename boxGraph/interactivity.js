// Functions to create interactivity (drag, key presses)
const canvas = document.getElementById('boxGraph');
const ctx = canvas.getContext('2d');

// Interactivity configurations
// Note: Buffer is the extra space around the line that will count as "interacting"
const LEFT_BAR_LINE_BUFFER = 10;
const RIGHT_BAR_LINE_BUFFER = 10;
const MIDDLE_BAR_LINE_BUFFER = 10;

const DEFAULT_CURSOR_STYLE = 'auto';
const VERTICAL_DRAG_CURSOR_STYLE = 'row-resize';
const HORIZONTAL_DRAG_CURSOR_STYLE = 'col-resize';

// Description: Changes the cursor to appropriate style depending on where mouse is
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
