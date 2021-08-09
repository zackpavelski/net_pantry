
const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");
const btnScanQR = document.getElementById("btn-scan-qr");



let scanning = false;
var lastScanned = "";
var items = [];

navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" } })
  .then(function(stream) {
    scanning = true;
    btnScanQR.hidden = true;
    canvasElement.hidden = false;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.srcObject = stream;
    video.height = 100;
    video.width = 100;
    video.play();
    tick();
    scan();
  });

qrcode.callback = res => {
  if (res) {
    items.push(res);
    console.log(res);
    console.log('adding!');
    if(!(lastScanned == res)){
      var inner = document.getElementById('itemTable').insertRow();
      var cell1 = inner.insertCell(0);
      cell1.innerHTML = res;
      //if the qr code scans out to a function call, exec()
      //that function call should be endOrder();
      if(res.includes("()")){
        eval(res);
      }
      alert('Added '+ res +' to the list!');
    }
    lastScanned = res;
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
    setTimeout(scan, 300);
  }
}
