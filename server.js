var express = require('express')();
var server = require('http').Server(express);

const PORT = process.env.PORT || 3000;

server.listen(PORT);

express.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});