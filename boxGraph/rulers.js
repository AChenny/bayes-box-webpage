// Functions to handle the rulers on the sides and bottom

// Globals
const canvas = document.getElementById('boxGraph');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Ruler configurations

// Description: Updates the rulers on the sides with the correct values
// Input: Probability floats for P(E|H), P(E|Not-H), P(H)
export function updateRulers(pEH=0.5, pENotH=0.5, pH=0.5) {
    // Get the height for left ruler
}