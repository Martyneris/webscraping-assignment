const fs = require('fs');
var casper = require('casper').create();
var x = require('casper').selectXPath;


casper.start('https://classic.flysas.com').viewport(1200,1000);

casper.wait(3000, function(){
    this.echo(this.getTitle());
})

casper.then(function() {
    this.click('.closeMarketSelectorLeft');
    console.log('button clicked')
});

casper.then(function() {
    this.click('.flOutDate');
    console.log('button clicked')
});

casper.then(function() {
    this.click('.ui-icon-circle-triangle-e');
    console.log('button clicked')
});

casper.then(function() {
    this.click('#ui-datepicker-div table tbody tr:nth-child(2) td:nth-child(1) a');
    console.log('button clicked')
});

casper.then(function() {
    this.click('.flInDate');
    console.log('button clicked')
});

casper.then(function() {
    this.click('#ui-datepicker-div table tbody tr:nth-child(2) td:nth-child(7) a');
    console.log('button clicked')
});

casper.thenEvaluate(function(depAirport,arrAirport) {
    document.querySelector('input[name="ctl00$FullRegion$MainRegion$ContentRegion$ContentFullRegion$ContentLeftRegion$CEPGroup1$CEPActive$cepNDPRevBookingArea$predictiveSearch$hiddenFrom"]').setAttribute('value', depAirport);
    document.querySelector('input[name="ctl00$FullRegion$MainRegion$ContentRegion$ContentFullRegion$ContentLeftRegion$CEPGroup1$CEPActive$cepNDPRevBookingArea$predictiveSearch$hiddenTo"]').setAttribute('value', arrAirport);
    // document.querySelector('form[name="aspnetForm"]').submit();
}, 'ARN','LHR');

casper.wait(5000, function(){
    casper.capture('screenshots/beforesearchpress.png');
    console.log('captured')
})

casper.then(function() {
    // this.click('#ctl00_FullRegion_MainRegion_ContentRegion_ContentFullRegion_ContentLeftRegion_CEPGroup1_CEPActive_cepNDPRevBookingArea_Searchbtn_ButtonLink')
    casper.click(x('//*[@id="ctl00_FullRegion_MainRegion_ContentRegion_ContentFullRegion_ContentLeftRegion_CEPGroup1_CEPActive_cepNDPRevBookingArea_Searchbtn_ButtonLink"]'))
    console.log('search button clicked')
});


casper.then(function(){
    casper.wait(15000, function(){
        console.log('clicked ok, new location is ' + this.getCurrentUrl());
    });
    casper.wait(2000, function(){
        var myText = casper.fetchText(x('/html/body'));
        console.log(myText)
        casper.then(function(){
            casper.capture('screenshots/before.png');
            console.log('captured')
        })
    })
});

casper.then(function() {
    this.click('.geetest_radar_tip_content');
    console.log('captcha clicked')
});

casper.wait(5000, function(){
    casper.capture('screenshots/after.png');
    console.log('captured')
})

casper.then(function(){
    this.mouseEvent('click', '.geetest_slider', "20%", "50%");
})

var triggerDragAndDrop = function (selectorDrag, selectorDrop) {

    // function for triggering mouse events
    var fireMouseEvent = function (type, elem, centerX, centerY) {
      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent(type, true, true, window, 1, 1, 1, centerX, centerY, false, false, false, false, 0, elem);
      elem.dispatchEvent(evt);
    };
  
    // fetch target elements
    var elemDrag = document.querySelector(selectorDrag);
    var elemDrop = document.querySelector(selectorDrop);
    if (!elemDrag || !elemDrop) return false;
  
    // calculate positions
    var pos = elemDrag.getBoundingClientRect();
    var center1X = Math.floor((pos.left + pos.right) / 2);
    var center1Y = Math.floor((pos.top + pos.bottom) / 2);
    pos = elemDrop.getBoundingClientRect();
    var center2X = Math.floor((pos.left + pos.right) / 2);
    var center2Y = Math.floor((pos.top + pos.bottom) / 2);
    
    // mouse over dragged element and mousedown
    fireMouseEvent('mousemove', elemDrag, center1X, center1Y);
    fireMouseEvent('mouseenter', elemDrag, center1X, center1Y);
    fireMouseEvent('mouseover', elemDrag, center1X, center1Y);
    fireMouseEvent('mousedown', elemDrag, center1X, center1Y);
  
    // start dragging process over to drop target
    fireMouseEvent('dragstart', elemDrag, center1X, center1Y);
    fireMouseEvent('drag', elemDrag, center1X, center1Y);
    fireMouseEvent('mousemove', elemDrag, center1X, center1Y);
    fireMouseEvent('drag', elemDrag, center2X, center2Y);
    fireMouseEvent('mousemove', elemDrop, center2X, center2Y);
    
    // trigger dragging process on top of drop target
    fireMouseEvent('mouseenter', elemDrop, center2X, center2Y);
    fireMouseEvent('dragenter', elemDrop, center2X, center2Y);
    fireMouseEvent('mouseover', elemDrop, center2X, center2Y);
    fireMouseEvent('dragover', elemDrop, center2X, center2Y);

    // release dragged element on top of drop target
    fireMouseEvent('drop', elemDrop, center2X, center2Y);
    fireMouseEvent('dragend', elemDrag, center2X, center2Y);
    fireMouseEvent('mouseup', elemDrag, center2X, center2Y);

    return true;
  };

  casper.then(function triggerDragAndDrop(selectorDrag, selectorDrop) {
    }, '.geetest_div_slice', '.geetest_div_fullbg');

  casper.wait(2000, function(){
        casper.capture('screenshots/afterdrag.png');
        console.log('captured')
  })

//   casper.then(function(){
//       this.echo(this.getCurrentUrl());
//   })
casper.then(function(){
    this.echo(this.getHTML());
})

casper.run();
