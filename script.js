// Global Variables
var pEH = 0.500;
var pENotH = 0.500;
var pH = 0.500;

//Formula scripts
function updateFormula(pEH, pENotH, pH) {
  //Update box1
  var box1 = document.getElementById('box1');
  box1.value = pEH.toFixed(3);
  document.getElementById('equation_values_denominator_peh').innerHTML = pEH.toFixed(3);
  //Update box2
  var box2 = document.getElementById('box2');
  box2.value = pH.toFixed(3);
  document.getElementById('equation_values_denominator_ph').innerHTML = pH.toFixed(3);
  //Update box3
  var box3 = document.getElementById('box3');
  box3.value = pENotH.toFixed(3);
  //Update formula text 1 P(NOT-H)
  var formVar1 = document.getElementById('formVar1');
  formVar1.innerHTML = (1 - pH).toFixed(3);
  //update var2
  var formVar2 = document.getElementById('formVar2');
  var pHE = (pEH * pH)/((pEH * pH) + (pENotH * (1 - pH)));
  formVar2.innerHTML = pHE.toFixed(3);
}

//--------------------

function getVerticalPercentage(height) {
  var heightInt = height / 435;

  return heightInt;
};

function getHorizontalPercentage(width) {
  // var widthInt = parseInt(width.slice(0, width.length - 2));
  var widthInt = (width - 5) / 800;

  return widthInt;
};

//Redraw with new formula
function redraw(pEH, pENotH, pH) {
  var maxHeight = 435
  var maxWidth = 800

  //LeftBox
  $('#leftInner').css('height', ((1-pEH) * maxHeight))

  //RightBox
  $('#rightInner').css('height', ((1-pENotH) * maxHeight))

  //Box Widths
  $('#leftBar').css('width', ((pH) * maxWidth) + 5);
  $('#rightBar').css('width', ((1-pH) * maxWidth) + 5);

};

function updateLabels(pEH, pENotH, pH) {
  let maxHeight = 435;
  let maxWidth = 800;
  let pHE = ((pEH * pH)/((pEH * pH) + (pENotH * (1 - pH)))).toFixed(3);

  //Update inner bar labels
  $('#leftBarPercentage').html(pHE);
  $('#rightBarPercentage').html((1- parseFloat(pHE)).toFixed(3));

  //Left and right bargraph labels
  $('#bar_leftLabel').css('height', (((pEH*100)/2) + 3) + '%');
  $('#bar_rightLabel').css('height', (((pENotH*100)/2) + 3) + '%');

  $('#heightRulerLeft').css('height', (pEH * 100) + '%');
  $('#heightRulerRight').css('height', (pENotH * 100) + '%');

  //Update Middle Label
  if (pH < 0.05) {
    $('#bar_middle_left_label > p').css('font-size', ((pH * 20) * 16) + 'px');
  }
  if (pH > 0.9) {
    $('#bar_middle_right_label > p').css('font-size', ((1-pH) * 10) * 16 + 'px');
  }

  // Change the brightness of the probable label on probability change
  let rgbToHex = function (rgb) { 
    if (rgb < 50) {
      rgb = 50;
    }

    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
  };

  let probableSaturation = rgbToHex(Math.abs(parseInt(((pHE * 2) - 1) * 255)));
  $('#probableTag').css('color', '#' +  probableSaturation + probableSaturation + probableSaturation);
  // Change the brightness of the confirmed label on probability change
  let confirmationSaturation = rgbToHex(Math.abs(parseInt(((pHE - pH) / (1-pH)) * 255)));
  $('#confirmedTag').css('color', '#' +  confirmationSaturation + confirmationSaturation + confirmationSaturation);
  if (pHE == 0.500) {
    $('#imTag').css('color', '#000000');
  }
  else if (pHE > 0.500) {
    $('#imTag').css('color', '#000000');
  }
  else if (pHE < 0.500) {
    $('#imTag').css('color', '#' +  probableSaturation + probableSaturation + probableSaturation);
  }
  if (pHE == pH.toFixed(3)) {
    $('#disTag').css('color', '#000000');
  }
  else if (pHE > pH.toFixed(3)) {
    $('#disTag').css('color', '#000000');
  }
  else if (pHE < pH.toFixed(3)) {
    $('#disTag').css('color', '#' +  confirmationSaturation + confirmationSaturation + confirmationSaturation);
  }

  //Update inner labels
  //After 10% vertHeight, lower font size by 1px every .01
  //After 5%, display none
  //Left inner
  if (pEH < 0.1 || pH < 0.1) {
    $('#leftBarPercentage').css('font-size', 28 - 3*(10-(Math.min(pEH,pH) * 100)))
  }

  if (pENotH < 0.1 || pH > 0.9) {
    $('#rightBarPercentage').css('font-size', 28 - 3*(10-(Math.min(pENotH,(1-pH)) * 100)))
  }

  //Margin top for vertical
  //FIXME Or TODO: Want to set the inner text to the middle of the bar, but for some reason, margin % scale correctly
  let leftHeight = ($('#leftInner').css('height')).split("px")[0]
  if (pEH < 0.1) {
    $('#leftBarPercentage').css('margin-top', '0%');
  }
  else {
    $('#leftBarPercentage').css('margin-top', 197.5 - (leftHeight/2));
  }
  let rightHeight = ($('#rightInner').css('height')).split("px")[0]
  if (pENotH < 0.1) {
    $('#rightBarPercentage').css('margin-top', '0%');
  }
  else {
    $('#rightBarPercentage').css('margin-top', 197.5 - (rightHeight/2));
  }

}

function toggleVisualEstimator(toggleOn) {
  if (toggleOn) {
    $('#rightBarPercentage').hide();
    $('#leftBarPercentage').hide();
    $('#formVar2').hide();
    $('#formulaEquationBoxes').hide();
  }
  else {
    $('#rightBarPercentage').show();
    $('#leftBarPercentage').show();
    $('#formVar2').show();
    $('#formulaEquationBoxes').show();
  }
}

$(document).ready(function() {
  var horzDragging = false;
  var leftVertDrag = false;
  var rightVertDrag = false;
  var startPosX = 0;
  var startPosY = 0;

  updateLabels(pEH, pENotH, pH)

  //Function for pressing the verticalDivisionBar
  $('#verticalDivisionBar').mousedown(function(e){
    //Prevent default to prevent the weird cursor thing when dragging a div.
    e.preventDefault();

    horzDragging = true;
    startPosX = e.pageX - $('#bar').offset().left;

  });

  //Function for pressing the left horizontal division bar
  $('#leftDivisionBar').mousedown(function(e){
    e.preventDefault();

    leftVertDrag = true;
    startPosY = e.pageY - $('#bar').offset().top;
  });

  //Function for pressing the right horizontal division bar
  $('#rightDivisionBar').mousedown(function(e) {
    e.preventDefault();

    rightVertDrag = true;
    startPosY = e.pageY - $('#bar').offset().top;
  });

  $(document).mousemove(function(e){
    //updateBargraph
    if (horzDragging) {
      var posInGraphX = e.pageX - $('#bar').offset().left;

      var offset = posInGraphX - startPosX;

     // Necessary to get new widths in a seperate variable instead of putting it in the css call, or dragging
     // too fast will make it go to the next line
      var newLeftWidth = Math.round(10* ($('#leftBar').outerWidth()))/10 + offset;
      var newRightWidth = Math.round(10* ($('#rightBar').outerWidth()))/10 - offset;

      if (newLeftWidth < 5) {
        newLeftWidth = 5;
        newRightWidth = 805;
      }
      else if (newLeftWidth > 805) {
        newLeftWidth = 805;
        newRightWidth = 5;
      }
      $('#leftBar').css('width', newLeftWidth);
      $('#rightBar').css('width', newRightWidth);

      //Add offset to middle bar label
      var newMiddleLeft = parseInt($('#bar_middleLabel').css('left')) + offset;
      if (newMiddleLeft < 180) {
        newMiddleLeft = 180;
      }
      else if (newMiddleLeft > 980) {
        newMiddleLeft = 980;
      }
      $('#bar_middleLabel').css('left', newMiddleLeft + 'px');

      pH = getHorizontalPercentage(newLeftWidth);

      updateFormula(pEH, pENotH, pH);

      startPosX = posInGraphX;
    }
    else if (leftVertDrag) {
      var posInGraphY = e.pageY - $('#bar').offset().top;
      var offset = posInGraphY - startPosY;

      var newLeftHeight = Math.round(10* ($('#leftInner').outerHeight()))/10 + offset;

      if (newLeftHeight < 0) {
        newLeftHeight = 0;
      }
      else if (newLeftHeight > 435) {
        newLeftHeight = 435;
      }

      $('#leftInner').css('height', newLeftHeight);
      // Add vertical offset to left bar label
      var newLeftLabelTop = parseInt($('#bar_leftLabel').css('top')) + offset;
      if (newLeftLabelTop < 50) {
        newLeftLabelTop = 50;
      }
      else if (newLeftLabelTop > 485) {
        newLeftLabelTop = 485;
      }

      pEH = getVerticalPercentage(435 - newLeftHeight);
      updateFormula(pEH, pENotH, pH);

      startPosY = posInGraphY;
    }
    else if (rightVertDrag) {
      var posInGraphY = e.pageY - $('#bar').offset().top;
      var offset = posInGraphY - startPosY;

      var newRightHeight = Math.round(10* ($('#rightInner').outerHeight()))/10 + offset;

      if (newRightHeight < 0) {
        newRightHeight = 0;
      }
      else if (newRightHeight > 435) {
        newRightHeight = 435;
      }

      $('#rightInner').css('height', newRightHeight);
      // Add vertical offset to right bar label
      var newRightLabelTop = parseInt($('#bar_rightLabel').css('top')) + offset;
      if (newRightLabelTop < 50) {
        newRightLabelTop = 50;
      }
      else if (newRightLabelTop > 485) {
        newRightLabelTop = 485;
      }

      pENotH = getVerticalPercentage(435 - newRightHeight);
      updateFormula(pEH, pENotH, pH);
      startPosY = posInGraphY;
    }

    //Update tags
    var pHE = ((pEH * pH)/((pEH * pH) + (pENotH * (1 - pH)))).toFixed(3);

    updateLabels(pEH, pENotH, pH)
  });

  $(document).mouseup(function(e) {
    horzDragging = false;
    leftVertDrag = false;
    rightVertDrag = false;
  });

  //On return key press
  $(document).on('keypress',function(e) {
    if(e.which == 13) {
        pEH = parseFloat($("input[name=box1]").val());
        pH = parseFloat($("input[name=box2]").val());
        pENotH = parseFloat($("input[name=box3]").val());
        updateFormula(pEH, pENotH, pH)
        redraw(pEH, pENotH, pH)
        updateLabels(pEH, pENotH, pH)
    }
  });

  $(function() {
    $('#someSwitchOptionDefault').change(function() {
      if ($(this).prop('checked')) {
        toggleVisualEstimator(1);
      }
      else {
        toggleVisualEstimator(0);
      }
    })
  })
});
