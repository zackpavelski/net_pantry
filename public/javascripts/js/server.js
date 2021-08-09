let http = require('http');
var fs = require('fs');

var express = require('express');
var app1 = express();

app1.use(express.static('/'));

function handleRequest (req, res) {

  fs.readFile(__dirname + '/login.html', //Load and display outputs to the index.html file
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });

}

http.createServer(handleRequest).listen(8000);