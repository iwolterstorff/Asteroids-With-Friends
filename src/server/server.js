const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

const config = require('../../config.json');

const PORT = process.env.PORT || 3000;

const WIDTH = config.width || 1500;
const HEIGHT = config.height || 700;

const FRAMERATE = 60;
const SHIP_SPEED = 5;


app.use(express.static(path.join(__dirname, "../client")));

io.sockets.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.player = {};

    socket.on('newPlayer', () => {
        socket.player = {
            id: socket.id,
            x: WIDTH / 2,
            y: HEIGHT / 2,
            angle: 0
        };
        socket.emit('allPlayers', getAllPlayers());
        socket.broadcast.emit('newPlayer', socket.player);
    });

    // data is one of: 'up', 'down', 'left', 'right'
    socket.on('playerMove', (data) => {
        // TODO: Implement space-y movement
        if (data === 'up') {
            socket.player.y -= SHIP_SPEED;
        }
        if (data === 'down') {
            socket.player.y += SHIP_SPEED;
        }
        if (data === 'left') {
            socket.player.x -= SHIP_SPEED;
        }
        if (data === 'right') {
            socket.player.x += SHIP_SPEED;
            // console.log('right');
        }

    });

    socket.on('playerMoveGun', (data) => {
        socket.player.angle = data;
    });

    socket.on('playerShoot', () => {
        // TODO: Figure out wth goes in here
    });
    
    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.player.id}`);
        io.emit('remove', socket.player.id);
    });

    setInterval(() => {
        socket.emit('allPlayers', getAllPlayers());
    }, 1000 / FRAMERATE);


});


// from https://github.com/Jerenaux/basic-mmo-phaser/blob/master/server.js
// returns all players in the game as an array
function getAllPlayers() {
    let players = [];
    Object.keys(io.sockets.connected).forEach((socketID) => {
        let player = io.sockets.connected[socketID].player;
        if (player) players.push(player);
    });
    return players;
}


http.listen(PORT, () => {
    console.log(`Server started on ${ PORT }`);
});

// From https://github.com/huytd/agar.io-clone/blob/master/src/server/lib/util.js
function findIndex(arr, id) {
    var len = arr.length;

    while (len--) {
        if (arr[len].id === id) {
            return len;
        }
    }

    return -1;
}