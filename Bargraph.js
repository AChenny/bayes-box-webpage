import * as rulers from "./rulers.js";
import * as interactivity from './interactivity.js';
import { updateValues } from './script.js';

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

export default class BarGraph {
    constructor(canvas, ruler_left_container, ruler_right_container, ruler_mid_container, estimator_mode = false, negative_results_mode = false) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ruler_left_container = ruler_left_container;
        this.ruler_right_container = ruler_right_container;
        this.ruler_mid_container = ruler_mid_container;
        this.estimator_mode = estimator_mode;
        this.negative_results_mode = negative_results_mode;
        
        this.canvas_width = canvas.width;
        this.canvas_height = canvas.height;

        this.left_bar_drag = false;
        this.right_bar_drag = false;
        this.middle_line_drag = false;
        
        this.leftY = 0;
        this.rightY = 0;
        this.middleX = 0;
    }

    update() {
        clear();
        drawBoxGraph(pEH, pENotH, pH);
        rulers.updateRulers(pEH, pENotH, pH);
        if (!this.estimator_mode && !this.negative_results_mode) {
            this.drawBoxText(pEH, pENotH, pH);
        }
        this.drawBorder();
        
        // requestAnimationFrame(update);
    }

    // Description: Clears the boxGraph of drawings
    clear() {
        this.ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
    }
    
    // Description: Draws a border around the canvas
    drawBorder() {
        this.ctx.lineWidth = CANVAS_BORDER_THICKNESS;
        this.ctx.strokeStyle = CANVAS_BORDER_COLOR;
        this.ctx.strokeRect(0, 0, this.canvas_width, this.canvas_height);
    }

    // Description: Draws the box graph
    // Input: P(E|H) floating point value, P(E|Not-H) floating point value, P(H) floating point value
    // Example: drawBoxGraph(0.32, 0.65, 0.64) draws a graph with left bar 32% height, right bar 65% height, and middle divider 64% to the right
    drawBoxGraph(pEH=0.5, pENotH=0.5, pH=0.5) {
        this.clear();
        // Note: When using the percentages and using it in the canvas, it must be inverted
        // Draw the left bar
        let leftBarHeight = (1-pEH) * this.canvas_height;
        let leftBarWidth = pH * this.canvas_width;
        
        if (this.negative_results_mode) {
            this.ctx.fillStyle = LEFT_BAR_COLOR_DESATURATED;
        }
        else {
            this.ctx.fillStyle = LEFT_BAR_COLOR;
        }
        this.ctx.fillRect(0, leftBarHeight, leftBarWidth, this.canvas_height);
        
        // Draw the left bar height line
        if (this.negative_results_mode) {
            this.ctx.strokeStyle = DESATURATED_BAR_LINE_COLOR;
        }
        else {
            this.ctx.strokeStyle = LEFT_BAR_LINE_COLOR;
        }
        this.ctx.lineWidth = LEFT_BAR_LINE_THICKNESS;
        this.ctx.beginPath();
        this.ctx.moveTo(0, leftBarHeight);
        this.ctx.lineTo(leftBarWidth, leftBarHeight);
        this.ctx.stroke();
        this.leftY = leftBarHeight;
        
        // Draw the right bar
        let rightBarHeight = (1-pENotH) * this.canvas_height;
        let rightBarWidth = pH * this.canvas_width;
        
        if (this.negative_results_mode) {
            this.ctx.fillStyle = RIGHT_BAR_COLOR_DESATURATED;
        }
        else {
            this.ctx.fillStyle = RIGHT_BAR_COLOR;
        }
        this.ctx.fillRect(rightBarWidth, rightBarHeight, this.canvas_width, this.canvas_height);
        
        // Draw the right bar height line
        if (this.negative_results_mode) {
            this.ctx.strokeStyle = DESATURATED_BAR_LINE_COLOR;
        }
        else {
            this.ctx.strokeStyle = RIGHT_BAR_LINE_COLOR;
        }
        this.ctx.lineWidth = RIGHT_BAR_LINE_THICKNESS;
        this.ctx.beginPath();
        this.ctx.moveTo(rightBarWidth, rightBarHeight);
        this.ctx.lineTo(this.canvas_width, rightBarHeight);
        this.ctx.stroke();
        this.rightY = rightBarHeight;
        
        // Draw the middle line
        let middleLineX = pH * this.canvas_width;
        this.ctx.strokeStyle = MIDDLE_BAR_LINE_COLOR;
        this.ctx.lineWidth = MIDDLE_BAR_LINE_THICKNESS;
        this.ctx.beginPath();
        this.ctx.moveTo(middleLineX, 0);
        this.ctx.lineTo(middleLineX, this.canvas_height);
        this.ctx.stroke();
        this.middleX = middleLineX;

        // Negative results border
        if (this.negative_results_mode) {
            this.ctx.strokeStyle = NEGATIVE_RESULTS_BAR_LINE_COLOR;
            this.ctx.lineWidth = NEGATIVE_RESULTS_BAR_LINE_THICKNESS;
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.middleX-MIDDLE_BAR_LINE_THICKNESS, leftBarHeight);
            this.ctx.stroke();

        }
        this.drawBorder();
        if (!this.negative_results_mode) {
            this.drawBoxText(pEH, pENotH, pH);
        }
        rulers.updateRulers(pEH, pENotH, pH);
        
        updateValues(pEH, pENotH, pH);
    }

    // Description: Draws the graph percentages inside the bar graphs
    // Input: Input: P(E|H) floating point value, P(E|Not-H) floating point value, P(H) floating point value
    drawBoxText(pEH=0.5, pENotH=0.5, pH=0.5) {
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
        let leftBarTextCoordsX = (((this.middleX-BOX_FONT_BUFFER) / 2)).toFixed(0);
        let leftBarTextCoordsY = ((this.canvas_height + this.leftY) / 2).toFixed(0);
        this.ctx.fillStyle = BOX_FONT_DEFAULT_COLOR;
        this.ctx.font = BOX_FONT_DEFAULT_WEIGHT + ' ' + leftBarFontSize + 'pt ' +  BOX_FONT_DEFAULT_STYLE;
        this.ctx.fillText(pHE, leftBarTextCoordsX, leftBarTextCoordsY);

        let rightBarTextCoordsX = (((this.middleX + this.canvas_width) - BOX_FONT_BUFFER)/2).toFixed(0);
        let rightBarTextCoordsY = ((this.canvas_height + this.rightY) / 2).toFixed(0);
        this.ctx.fillStyle = BOX_FONT_DEFAULT_COLOR;
        this.ctx.font = rightBarFontSize + 'pt ' + BOX_FONT_DEFAULT_STYLE + ' '; 
        this.ctx.fillText((1-pHE).toFixed(3), rightBarTextCoordsX, rightBarTextCoordsY);
    }

    // Description: Resets the drag booleans
    resetDragState() {
        this.left_bar_drag = false;
        this.right_bar_drag = false;
        this.middle_line_drag = false;
    }

    // Description: Changes all instances of E (evidence) to the negative
    // Input: state ? true (turn to E): false (turn to NOT-E)
    change_e_to_not_e (state){
        let e_text;
        e_text = state ? "&not;E" :"E";
        // Change text in evidence strength text
        $('#buttons_evidence_strength_formula_numerator').html(`<b><i>P</i></b>(${e_text}<b>|</b>H)`);
        $('#buttons_evidence_strength_formula_denominator').html(`<b><i>P</i></b>(${e_text}<b>|</b>&not;H)`);

        // Change text in Formula
        $('#formula_phe_text').html(`<p><b><i>P</i></b>(H<b>|</b>${e_text})</p>`);
        $('#formula_peh_top_text').html(`<b><i>P</i></b>(${e_text}<b>|</b>H)`);
        $('#formula_peh_bottom_text').html(`<b><i>P</i></b>(${e_text}<b>|</b>H)`);
        $('#formula_p_not_h_bottom_text').html(`<b><i>P</i></b>(${e_text}<b>|</b>&not;H)`);
    }

    
    // Description: Flips the rulers to positive results mode or negative results mode
    // Input: Boolean
    // Output: None
    setNegativeResultsRuler(flag) {
        // Negative results mode is on, set the rulers to P(H|E)
        this.change_e_to_not_e(flag);
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

    setNegativeResultsModeBoxGraph(flag) {
        this.negative_results_mode = flag;
    }
    

    handleCanvasMove(event, pEH, pENotH, pH) {
        // Handle changing the cursor
        interactivity.handleMouseCursor(event, this.leftY, this.rightY, this.middleX);
        if (this.left_bar_drag) {
            pEH = interactivity.handleVerticalBarDrag(event);
            this.drawBoxGraph(pEH, pENotH, pH);
        }
        if (this.right_bar_drag) {
            pENotH = interactivity.handleVerticalBarDrag(event);
            this.drawBoxGraph(pEH, pENotH, pH);
        }
        if (this.middle_line_drag) {
            pH = interactivity.handleHorizontalLineDrag(event);
            this.drawBoxGraph(pEH, pENotH, pH);
        }
    }

    handleCanvasMouseDown(event) {
        // Update the interactivity booleans
        if (interactivity.isMouseOnMiddleLine(event, this.middleX)) {
            this.middle_line_drag = true;
        }
        else if (interactivity.isMouseOnLeftBarLine(event, this.leftY, this.middleX)) {
            this.left_bar_drag = true;
        }
        else if (interactivity.isMouseOnRightBarLine(event, this.rightY, this.middleX)) {
            this.right_bar_drag = true;
        }
    }
}
