var dragging = false;
var startPosX = 0;
var startPosY = 0;
var endPosX = 0;
var endPosY = 0;
var i = 0;
$(document).ready(function() {

  //Function for pressing the verticalDivisionBar
  $('#verticalDivisionBar').mousedown(function(e){
    //Prevent default to prevent the weird cursor thing when dragging a div.
    e.preventDefault();

    dragging = true;
    startPosX = e.pageX - $('#bar').offset().left;

  });
  $(document).mousemove(function(e){

    if (dragging) {
      var posInGraphX = e.pageX - $('#bar').offset().left;

      offset = posInGraphX - startPosX;

     // Necessary to get new widths in a seperate variable instead of putting it in the css call, or dragging
     // too fast will make it go to the next line
      var newLeftWidth = Math.round(10* ($('#leftBar').outerWidth()))/10 + offset;
      var newRightWidth = Math.round(10* ($('#rightBar').outerWidth()))/10 - offset;

      $('#leftBar').css('width', newLeftWidth);
      $('#rightBar').css('width', newRightWidth);

      startPosX = posInGraphX;
      console.log(offset);
    }
  });

  $(document).mouseup(function(e) {
    dragging = false;
    // offSetX = startPosX - e.pageX;
  });
});
