
var chart;
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = google.visualization.arrayToDataTable([
  ['Probability', 'Percentage'],
  ['left', .5],
  ['right', .5],
  ]);

  var options = {'width': 350, 'height': 400, 'legend': 'none' };

  chart = new google.visualization.PieChart(document.getElementById('pieChart'));
  chart.draw(data, options);
};

function updatePieChart(chart, leftPercentage, rightPercentage) {
  var data = google.visualization.arrayToDataTable([
  ['left', leftPercentage],
  ['right', rightPercentage],
  ]);
  chart.clearChart();
  var options = {'width': 350, 'height': 400, 'legend': 'none' };
  chart.draw(data, options);
}

//Formula scripts
function updateFormula(pEH, pENotH, pH) {
  //Update box1
  var box1 = document.getElementById('box1');
  box1.value = pEH;
  //Update box2
  var box2 = document.getElementById('box2');
  box2.value = pH;
  //Update box3
  var box3 = document.getElementById('box3');
  box3.value = pENotH;
  //Update formula text 1 P(NOT-H)
  var formVar1 = document.getElementById('formVar1');
  formVar1.innerHTML = 1 - pH;
  //update var2
  var formVar2 = document.getElementById('formVar2');
  var pHE = (pEH * pH)/((pEH * pH) + (pENotH * (1 - pH)));
  formVar2.innerHTML = pHE.toFixed(3);
}


//--------------------

function getVerticalPercentage(height) {
  var heightInt = parseInt(height.slice(0, height.length - 2));
  heightInt = heightInt / 300;

  return heightInt;
};

function getHorizontalPercentage(width) {
  var widthInt = parseInt(width.slice(0, width.length - 2));
  widthInt = (widthInt - 5) / 600;

  return widthInt;
};

$(document).ready(function() {
  var horzDragging = false;
  var leftVertDrag = false;
  var rightVertDrag = false;
  var startPosX = 0;
  var startPosY = 0;

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

    if (horzDragging) {
      var posInGraphX = e.pageX - $('#bar').offset().left;

      var offset = posInGraphX - startPosX;

     // Necessary to get new widths in a seperate variable instead of putting it in the css call, or dragging
     // too fast will make it go to the next line
      var newLeftWidth = Math.round(10* ($('#leftBar').outerWidth()))/10 + offset;
      var newRightWidth = Math.round(10* ($('#rightBar').outerWidth()))/10 - offset;

      if (newLeftWidth < 5) {
        newLeftWidth = 5;
        newRightWidth = 605;
      }
      else if (newLeftWidth > 605) {
        newLeftWidth = 605;
        newRightWidth = 5;
      }
      $('#leftBar').css('width', newLeftWidth);
      $('#rightBar').css('width', newRightWidth);

      startPosX = posInGraphX;
    }
    else if (leftVertDrag) {
      var posInGraphY = e.pageY - $('#bar').offset().top;
      var offset = posInGraphY - startPosY;

      var newLeftHeight = Math.round(10* ($('#leftInner').outerHeight()))/10 + offset;

      if (newLeftHeight < 0) {
        newLeftHeight = 0;
      }
      else if (newLeftHeight > 300) {
        newLeftHeight = 300;
      }

      $('#leftInner').css('height', newLeftHeight);

      startPosY = posInGraphY;
    }
    else if (rightVertDrag) {
      var posInGraphY = e.pageY - $('#bar').offset().top;
      var offset = posInGraphY - startPosY;

      var newRightHeight = Math.round(10* ($('#rightInner').outerHeight()))/10 + offset;

      if (newRightHeight < 0) {
        newRightHeight = 0;
      }
      else if (newRightHeight > 300) {
        newRightHeight = 300;
      }

      $('#rightInner').css('height', newRightHeight);

      startPosY = posInGraphY;
    }
  });

  $(document).mouseup(function(e) {
    horzDragging = false;
    leftVertDrag = false;
    rightVertDrag = false;
  });
});
