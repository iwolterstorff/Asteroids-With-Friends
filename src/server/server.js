const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

const config = require('../../config.json');

const PORT = process.env.PORT || 3000;

const WIDTH = config.width || 1500;
const HEIGHT = config.height || 700;
const DEFRADIUS = config.defaultRadius || 40;
const DEFVEL = config.defaultMissileVelocity || 3;

const FRAMERATE = 60;
const SHIP_SPEED = 5;

// I intend to add more functionality to this class over time
let Missile = class Missile {
    constructor(x, y, vel, angle) {
        this.x = x;
        this.y = y;
        this.vel = vel;
        this.angle = angle;
    }
};

app.use(express.static(path.join(__dirname, "../client")));

app.get('/config.json', (req, res) => {
    res.sendFile(path.join(__dirname, "../../config.json"));
});

io.sockets.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.player = {};

    socket.on('newPlayer', () => {
        socket.player = {
            id: socket.id,
            x: WIDTH / 2,
            y: HEIGHT / 2,
            radius: DEFRADIUS,
            angle: 0,
            missiles: []
        };
        socket.emit('allPlayers', getAllPlayers());
        socket.broadcast.emit('newPlayer', socket.player);
    });

    socket.on('playerMove', (data) => {
        // TODO: Implement space-y movement
        if (data.up) {
            socket.player.y -= SHIP_SPEED;
        }
        if (data.down) {
            socket.player.y += SHIP_SPEED;
        }
        if (data.left) {
            socket.player.x -= SHIP_SPEED;
        }
        if (data.right) {
            socket.player.x += SHIP_SPEED;
            // console.log('right');
        }

    });

    socket.on('playerMoveGun', (data) => {
        socket.player.angle = data;
    });

    socket.on('playerShoot', () => {
        socket.player.missiles.push(new Missile(socket.player.x, socket.player.y, DEFVEL, socket.player.angle));
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