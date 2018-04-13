'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);

const Victor = require('victor');

const config = require('../../config.json');

const PORT = process.env.PORT || 3000;

const WIDTH = config.width || 1500;
const HEIGHT = config.height || 700;
const MARGIN = 40;
const DEFRADIUS = config.defaultRadius || 40;
const DEFVEL = config.defaultMissileVelocity || 3;

const FRAMERATE = 60;
const SHIP_SPEED = 0.5;

// I intend to add more functionality to this class over time
let Missile = class Missile {
    constructor(x, y, vel, angle) {
        this.x = x;
        this.y = y;
        this.vel = vel;
        this.angle = angle;
    }
};

const Player = function(id) {
    this.id = id;
    this.pos = { x: WIDTH / 2, y: HEIGHT / 2 };
    // this.pos = newCenter;
    // this.pos = { x: WIDTH / 2, y: HEIGHT / 2 };
    // this.vel = newZero;
    // this.vel = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.radius = DEFRADIUS;
    this.angle = 0;
    this.missiles = [];
    this.health = 100;
};

app.use(express.static(path.join(__dirname, "../client")));

app.get('/config.json', (req, res) => {
    res.sendFile(path.join(__dirname, "../../config.json"));
});

io.sockets.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.player = {};

    socket.on('newPlayer', () => {
        socket.player = new Player(socket.id);
        socket.player.pos = new Victor(socket.player.pos.x, socket.player.pos.y);
        socket.player.vel = new Victor(socket.player.vel.x, socket.player.vel.y);
        socket.emit('allPlayers', getAllPlayers());
        socket.broadcast.emit('newPlayer', socket.player);
    });

    socket.on('playerMove', (data) => {
        // TODO: Implement space-y movement
        if (data.up) {
            socket.player.vel = socket.player.vel.addY(new Victor(0, -SHIP_SPEED));
        }
        if (data.down) {
            socket.player.vel = socket.player.vel.addY(new Victor(0, SHIP_SPEED));
        }
        if (data.left) {
            socket.player.vel = socket.player.vel.addX(new Victor(-SHIP_SPEED, 0));
        }
        if (data.right) {
            socket.player.vel = socket.player.vel.addX(new Victor(SHIP_SPEED, 0));
            // console.log('right');
        }

    });

    socket.on('playerMoveGun', (data) => {
        socket.player.angle = data;
    });

    socket.on('playerShoot', () => {
        socket.player.missiles.push(new Missile(socket.player.pos.x, socket.player.pos.y, DEFVEL, socket.player.angle));
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.player.id}`);
        io.emit('remove', socket.player.id);
    });

    setInterval(() => {
        gameTick(socket.player);
        socket.emit('allPlayers', getAllPlayers());
    }, 1000 / FRAMERATE);


});

let time, isDead;
function gameTick(player) {
    if ('pos' in player) {
        player.pos = player.pos.add(player.vel);
        if (player.pos.x < -MARGIN) player.pos.x = WIDTH + MARGIN;
        if (player.pos.x > WIDTH + MARGIN) player.pos.x = -MARGIN;
        if (player.pos.y < -MARGIN) player.pos.y = HEIGHT + MARGIN;
        if (player.pos.y > HEIGHT + MARGIN) player.pos.y = -MARGIN;
    }

    if (player.missiles instanceof Array) {
        player.missiles.forEach((miss, missIndex, missArray) => {
            miss.x += miss.vel * Math.cos(miss.angle);
            miss.y += miss.vel * Math.sin(miss.angle);

            getAllPlayers().forEach((arrPlayer, playerIndex, playerArray) => {
                if (arrPlayer !== player) {
                    if (distance(miss.x, miss.y, arrPlayer.x, arrPlayer.y) <= arrPlayer.radius) {
                        arrPlayer.health -= 10;
                        // TODO: MAKE THE MISSILE BLOW UPPPPP
                        missArray.splice(missIndex, 1);
                    }
                }
                if (arrPlayer.health <= 0) {
                    //io.emit('remove', socket.player.id);
                    arrPlayer.x = -100000;
                    arrPlayer.y = -100000;
                    setTimeout(() => {
                        arrPlayer.x = WIDTH / 2;
                        arrPlayer.y = HEIGHT / 2;
                        arrPlayer.health = 100;
                    }, 1000);
                }
            });

            // Delete missiles that leave the game borders
            if (miss.x > WIDTH + 50 || miss.x < 0 - 50 || miss.y > HEIGHT + 50 || miss.y < 0 - 50) {
                missArray.splice(missIndex, 1);
            }
        });
    }
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


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