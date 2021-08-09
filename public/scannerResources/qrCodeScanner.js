
const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");
const btnScanQR = document.getElementById("btn-scan-qr");
//$ = require('jquery')(new jsdom.JSDOM().window);;


/*qty counter*/

function wcqib_refresh_quantity_increments() {
  jQuery("div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)").each(function(a, b) {
      var c = jQuery(b);
      c.addClass("buttons_added"), c.children().first().before('<input type="button" value="-" class="minus" />'), c.children().last().after('<input type="button" value="+" class="plus" />')
  })
}
String.prototype.getDecimals || (String.prototype.getDecimals = function() {
  var a = this,
      b = ("" + a).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  return b ? Math.max(0, (b[1] ? b[1].length : 0) - (b[2] ? +b[2] : 0)) : 0
}), jQuery(document).ready(function() {
  wcqib_refresh_quantity_increments()
}), jQuery(document).on("updated_wc_div", function() {
  wcqib_refresh_quantity_increments()
}), jQuery(document).on("click", ".plus, .minus", function() {
  var a = jQuery(this).closest(".quantity").find(".qty"),
      b = parseFloat(a.val()),
      c = parseFloat(a.attr("max")),
      d = parseFloat(a.attr("min")),
      e = a.attr("step");
  b && "" !== b && "NaN" !== b || (b = 0), "" !== c && "NaN" !== c || (c = ""), "" !== d && "NaN" !== d || (d = 0), "any" !== e && "" !== e && void 0 !== e && "NaN" !== parseFloat(e) || (e = 1), jQuery(this).is(".plus") ? c && b >= c ? a.val(c) : a.val((b + parseFloat(e)).toFixed(e.getDecimals())) : d && b <= d ? a.val(d) : b > 0 && a.val((b - parseFloat(e)).toFixed(e.getDecimals())), a.trigger("change")
});



let scanning = false;
var lastQuantity = "";
var lastScanned = "";
var items = [];
video.setAttribute('autoplay', '');
video.setAttribute('muted', '');
video.setAttribute('playsinline', '');

navigator.mediaDevices

  .getUserMedia({video: {width: 720, heigh: 720}})
  .then(function(stream) {
    scanning = true;
    
    video.setAttribute("playsinline", ''); // required to tell iOS safari we don't want fullscreen
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.srcObject = stream;
    video.onloadedmetadata = function(e){
      video.play();
    }
    tick();
    scan();
  });

qrcode.callback = res => {
  

  
  if (res) {
    items.push(res);
    console.log(res);
    console.log('adding!'); 
    //add only if the quantity is different and the item is different
    if(!(lastScanned == res) || !(document.getElementById('number').value == lastQuantity)){
      const inner = document.getElementById('itemTable').insertRow();
      
      const cell1 = inner.insertCell(0);
      const cell2 = inner.insertCell(1);
      cell1.innerHTML = res;
      cell2.innerHTML = document.getElementById('number').value;

      var repeat = (res + ', ').repeat(document.getElementById('number').value);
      document.getElementsByTagName("p")[0].innerHTML += repeat;
      console.log(repeat);
      setTimeout(function(){  }, 3000);

      //if the qr code scans out to a function call, exec()
      if(res.includes("()")){
        eval(res);
      }
    }
    lastScanned = res;
    lastQuantity = document.getElementById('number').value;
    setti
    tick();
    scan();
  }
};


function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
    setTimeout(scan, 2000);

  } catch (e) {
    setTimeout(scan, 2000);
  }
}

