// Import constants 
import * as constants from './constants.js';
import { updateBoxGraphValues, setEstimatorModeBoxGraph, setNegativeResultsModeBoxGraph, setNegativeResultsRuler} from './boxGraph/main.js';

// Global Variables
var pEH = 0.500;
var pENotH = 0.500;
var pH = 0.500;

// Description: Exportable value updater for this scope
// Input: Probability values in float <1;
// Example: updateBoxValues(0.500, 0.522, 1.000);
export function updateValues(_pEH, _pENotH, _pH) {
  pEH = parseFloat(_pEH);
  pENotH = parseFloat(_pENotH);
  pH = parseFloat(_pH);
  
  updateFormula(pEH, pENotH, pH);
  _updateLights(pEH, pENotH, pH);
}

function updateFormula(pEH, pENotH, pH) {
  // If the user is using any of the input boxes, don't update it.
  if (!$("#box1").is(":focus")) {
    var box1 = document.getElementById('box1');
    box1.value = pEH.toFixed(3);
  };
  document.getElementById('equation_values_denominator_peh').innerHTML = pEH.toFixed(3);
  
  // Box 2 
  if (!$("#box2").is(":focus")) {
    var box2 = document.getElementById('box2');
    box2.value = pH.toFixed(3);
  };
  document.getElementById('equation_values_denominator_ph').innerHTML = pH.toFixed(3);

  // Box 3
  if (!$("#box3").is(":focus")) {
    var box3 = document.getElementById('box3');
    box3.value = pENotH.toFixed(3);
  };

  //Update formula text 1 P(NOT-H)
  var formVar1 = document.getElementById('formVar1');
  formVar1.innerHTML = (1 - pH).toFixed(3);
  //update var2
  var formVar2 = document.getElementById('formVar2');
  var pHE = (pEH * pH)/((pEH * pH) + (pENotH * (1 - pH)));
  formVar2.innerHTML = pHE.toFixed(3);

  // Update the box graph values
  updateBoxGraphValues(pEH, pENotH, pH);
}

function toggleVisualEstimator(toggleOn) {
  if (toggleOn) {
    $('#formVar1').hide();
    $('#formVar2').hide();
    $('#believe_confirmation_evidence_strength_value_span').hide();
    $('#box1').css('color', '#FFFFFF');
    $('#box2').css('color', '#FFFFFF');
    $('#box3').css('color', '#FFFFFF');
    $('#equation_values_denominator_peh').hide();
    $('#equation_values_denominator_ph').hide();
    
  }
  else {
    $('#formVar1').show();
    $('#formVar2').show();
    $('#believe_confirmation_evidence_strength_value_span').show();
    $('#box1').css('color', '#000000');
    $('#box2').css('color', '#000000');
    $('#box3').css('color', '#000000');
    $('#equation_values_denominator_peh').show();
    $('#equation_values_denominator_ph').show();
  }
}

function randomizeButton() {
  pEH = parseFloat(Math.random(1000).toFixed(3));
  pH = parseFloat(Math.random(1000).toFixed(3));
  pENotH = parseFloat(Math.random(1000).toFixed(3));
  updateFormula(pEH, pENotH, pH);
  _updateLights(pEH, pENotH, pH)
  updateBoxGraphValues(pEH, pENotH, pH);
}

// Description: Updates the Evidence strength, prior probability, and updated probability saturation
// Input: Probability values (pEH, pENotH, pH)
// Example: _updateLights(0.500, 0.522, 0.662)
function _updateLights(pEH, pENotH, pH) {
  let pHE = ((pEH * pH)/((pEH * pH) + (pENotH * (1 - pH)))).toFixed(3);

  let rgbToHex = function (rgb) { 
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  };

  // Description: Gets the number and return the next highest number in the logspace array using a binary search
  // Input: Some positive number x
  // Output: Position in the logspace constant
  let getPosInLogspace = function(x) {
    let start=0, end=constants.logspace.length-1;
    // Exceptions is if x is greater than max or min, set the saturation to that
    if (x < constants.MIN_EVIDENCE_STRENGTH_SATURATION) {
      return 0;
    }
    if (x > constants.MAX_EVIDENCE_STRENGTH_SATURATION) {
      return 254;
    }
    while (start<=end) {
      // Iterate until You find a two numbers that this number can fit in
      let i = Math.floor((start + end)/2);
      if (constants.logspace[i-1] < x  && x <= constants.logspace[i] ) return i;

      else if (constants.logspace[i] < x) {
        start = i + 1
      } 
      else {
        end = i - 1;
      }
    }
  }

  let probableSaturation = rgbToHex(parseInt((pH * 255)));
  $('#believe_confirmation_prior_probability_light').css('background-color', '#' +  probableSaturation + probableSaturation + probableSaturation);
  $('#believe_confirmation_prior_probability_light_text').css('color', '#' +  rgbToHex(parseInt(((1-pH) * 255))) + rgbToHex(parseInt(((1-pH) * 255))) + rgbToHex(parseInt(((1-pH) * 255))));
  
  // Change the brightness of the evidence strength light on probability change
  let evidenceStrengthCalculation = pEH/pENotH;

  if (isFinite(evidenceStrengthCalculation)) {
    $('#believe_confirmation_evidence_strength_value_span').text(evidenceStrengthCalculation.toFixed(2));
  }
  else {
    $('#believe_confirmation_evidence_strength_value_span').text('Maximum');
  }

  let confirmationRHex = rgbToHex(parseInt(144));
  let confirmationGHex = rgbToHex(parseInt(144 + ((evidenceStrengthCalculation/2) * 111)));
  let confirmationBHex = rgbToHex(parseInt(144 + ((1-(evidenceStrengthCalculation/2)) * 111)));
  $('#believe_confirmation_evidence_strength_light').css('background-color', '#' + confirmationRHex + confirmationGHex  + confirmationBHex );

  // Change the brightness of the updated probability light and the text to inverse
  let updatedProbabilitySaturation = rgbToHex(parseInt(pHE*255));
  $('#believe_confirmation_updated_probability_light').css('background-color', '#' + updatedProbabilitySaturation + updatedProbabilitySaturation + updatedProbabilitySaturation);
  $('#believe_confirmation_updated_probability_light_text').css('color', '#' + rgbToHex(parseInt((1-pHE)*255)) + rgbToHex(parseInt((1-pHE)*255)) + rgbToHex(parseInt((1-pHE)*255)));
}

$(document).ready(function() {
  _updateLights(pEH, pENotH, pH)

  $('#randomize_button').click(randomizeButton);
  
  //On return key press
  $(document).on('keypress',function(e) {
    if(e.which == 13) {
        pEH = parseFloat($("input[name=box1]").val());
        pH = parseFloat($("input[name=box2]").val());
        pENotH = parseFloat($("input[name=box3]").val());
        
        // Unfocus the box to allow for update
        $('#box1').blur()
        $('#box2').blur()
        $('#box3').blur()
        updateFormula(pEH, pENotH, pH)
    }
  });

  $(function() {
    $('#buttons_estimator_switch').change(function() {
      if ($(this).prop('checked')) {
        toggleVisualEstimator(1);
        setEstimatorModeBoxGraph(true);
      }
      else {
        toggleVisualEstimator(0);
        setEstimatorModeBoxGraph(false);
      }
    })
  })
});
$(function() {
  $('#buttons_negative_results_switch').change(function() {
    if ($(this).prop('checked')) {
      setNegativeResultsModeBoxGraph(true);
      setNegativeResultsRuler(true);
    }
    else {
      setNegativeResultsModeBoxGraph(false);
      setNegativeResultsRuler(false);
    }
  });
})
