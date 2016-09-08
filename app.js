var http = require('http');
var express = require('express');
var app = express();

var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("hello worldsaaa!\n");
});

app.get('/asd', function(req, res) {
    res.send('hello world');
});

server.listen(3000);