const PORT = process.env.PORT || 3000;

var http = require('http');
var fs = require('fs');
var path = require('path');

function handleRequest(req, res) {
    var pathname = req.url;

    if (pathname == '/') {
        pathname = '/index.html';
    }

    var ext = path.extname(pathname);

    var typeExt = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
    };

    var contentType = typeExt[ext] || 'text/plain';

    fs.readFile(__dirname + pathname, (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + pathname);
        }
        res.writeHead(200, { 'Content-Type': contentType});
        res.end(data);
    });
}

var server = http.createServer(handleRequest);

server.listen(PORT);

var io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
    console.log("Client connected: " + socket.id);
    socket.on('disconnect', () => {
        console.log("Client disconnected");
    });
    socket.on('mouse', (data) => {
        console.log("Received: 'mouse' " + data.x + " " + data.y);
        socket.broadcast.emit('mouse', data);
    });
    socket.on('clear', () => {
        socket.broadcast.emit('clear');
    });
});

console.log(`Server started on ${ PORT }`);