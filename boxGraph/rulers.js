// Functions to handle the rulers on the sides and bottom

// Globals
const canvas = document.getElementById('boxGraph');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const LEFT_HORIZONTAL_RULER = document.getElementById('leftHorizontalRuler');
const LEFT_VERTICAL_BOTTOM_RULER = document.getElementById('verticalRulerLeftBottom');
const RIGHT_VERTICAL_BOTTOM_RULER = document.getElementById('verticalRulerRightBottom');

// Ruler configurations
const HORIZONTAL_BAR_MAX_FONT_SIZE = 12; // in point size

// Description: Updates the rulers on the sides with the correct values
// Input: Probability floats for P(E|H), P(E|Not-H), P(H)
export function updateRulers(pEH=0.5, pENotH=0.5, pH=0.5) {
    let leftHorizontalRulerWidthStyle = (pH * 100) + '%';
    let leftVerticalBottomRulerHeightStyle = (pEH * 100) + '%';
    let rightVerticalBottomRulerHeightStyle = (pENotH * 100) + '%';
    LEFT_HORIZONTAL_RULER.style.width = leftHorizontalRulerWidthStyle;
    LEFT_VERTICAL_BOTTOM_RULER.style.height = leftVerticalBottomRulerHeightStyle;
    RIGHT_VERTICAL_BOTTOM_RULER.style.height = rightVerticalBottomRulerHeightStyle;

    // If the percentages for the horizontal bar are too low or high, reduce the font size
    if (pH < 0.1) {
        let percentage = pH * 10;
        let reducedFontSize = (HORIZONTAL_BAR_MAX_FONT_SIZE * percentage).toFixed(0); 
        $('#leftHorizontalRulerText p').css('font-size', reducedFontSize + 'pt');
    }
    else if (pH >= 0.9) {
        let percentage = (1-pH) * 10;
        let reducedFontSize = (HORIZONTAL_BAR_MAX_FONT_SIZE * percentage).toFixed(0); 
        $('#rightHorizontalRulerText p').css('font-size', reducedFontSize + 'pt');
    }
    else {
        $('#leftHorizontalRulerText p').css('font-size', HORIZONTAL_BAR_MAX_FONT_SIZE + 'pt');
        $('#rightHorizontalRulerText p').css('font-size', HORIZONTAL_BAR_MAX_FONT_SIZE + 'pt');
    }
}