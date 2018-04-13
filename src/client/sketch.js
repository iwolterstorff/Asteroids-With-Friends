'use strict';

// A Player contains the following fields: {id, x, y, radius, angle, missiles(array of Missile)}


let config;
// These will be hard-coded on clientside until i find a good way to import them from config.json
let WIDTH = 1500;
let HEIGHT = 700;
let DEFRADIUS = 40;


let Dirs = class Dirs {
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }
};

let keys;

let currentDirs;


let world = {
    players: {}
};

let player, canvas, inputMessage, inputBox, inputButton;

let name;



world.updatePlayer = (playerData) => {
    if (playerData.id !== undefined) {
        world.players[playerData.id] = playerData;
    }
};

world.removePlayer = (id) => {
    console.log(`Player removed: ${id}`);
    delete world.players[id];
};

// function preload() {
//     config = loadJSON("../../config.json");
//     WIDTH = config.width;
//     HEIGHT = config.height;
//     DEFRADIUS = config.defaultRadius;
// }

function submitInput() {
    name = inputBox.value();
    player.name = name;
    inputMessage.hide();
    inputBox.hide();
    inputButton.hide();
    client.addThisPlayer();
    canvas.show();
}

function resetInput() {
    inputBox.value('');
    inputMessage.show();
    inputBox.show();
    inputButton.show();
    canvas.hide();
}

let bg, playerImage, turretImage, missileImage;
let loginBox;

// const newCenter = createVector(WIDTH / 2, HEIGHT / 2);
// const newZero = createVector(0, 0);

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
    this.visible = true;
};

function setup() {
    bg = loadImage('/assets/backg.png');
    playerImage = loadImage('/assets/Cannon-hd.png');
    turretImage = loadImage('/assets/Turret-hd.png');
    missileImage = loadImage('/assets/PlayerMissile-hd.png');
    canvas = createCanvas(WIDTH, HEIGHT);
    // canvas.parent('game-canvas');
    background(bg);
    loginBox = select('login-box');
    // canvas.hide();

    // inputMessage = createElement('h2', 'What\'s your name?');
    // inputBox = createInput('');
    // inputButton = createButton('submit');
    // inputButton.mousePressed(submitInput);

    currentDirs = new Dirs();

    player = new Player(client.socket.id);

    client.addThisPlayer();

    keys = {
        up: [UP_ARROW, 87],
        down: [DOWN_ARROW, 83],
        left: [LEFT_ARROW, 65],
        right: [RIGHT_ARROW, 68]
    };


}

function draw() {
    background(bg);
    let allPlayers = world.players;

    // Render spaceships with turrets
    for (let p in allPlayers) {
        if (allPlayers.hasOwnProperty(p)) {
            fill(255);
            let aPlayer = allPlayers[p];
            push();
            translate(aPlayer.pos.x, aPlayer.pos.y);
            // ellipse(0, 0, aPlayer.radius * 2, aPlayer.radius * 2);
            imageMode(CENTER);
            if (aPlayer.visible) {
                image(playerImage, 0, 0, aPlayer.radius * 2, aPlayer.radius * 2);
            }
            imageMode(CORNER);

            // Draw health bar
            if (aPlayer.visible) {
                push();
                strokeWeight(4);
                stroke(240, 0, 1);
                line(-aPlayer.radius, aPlayer.radius + 5, aPlayer.radius, aPlayer.radius + 5);

                stroke(34, 255, 0);
                line(-aPlayer.radius, aPlayer.radius + 5, map(aPlayer.health, 0, 100, -aPlayer.radius, aPlayer.radius), aPlayer.radius + 5);
                pop();
            }

            push();
            rotate(aPlayer.angle + (PI / 2));
            // line(0, 0, aPlayer.radius, 0);
            imageMode(CENTER);
            if (aPlayer.visible) {
                image(turretImage, 0, 0, aPlayer.radius * 2, aPlayer.radius * 2);
            }
            imageMode(CORNER);
            pop();

            // Pop the matrix transformation
            pop();

            // Render missiles
            aPlayer.missiles.forEach((item, index, array) => {
                push();
                translate(item.x, item.y);
                rotate(item.angle + (PI / 2));
                // fill(192, 192, 192);
                // triangle(-10, 30, 10, 30, 0, 0);
                image(missileImage, 0, 0);
                pop();
            });

            if (aPlayer.id === player.id) {
                player = aPlayer;
            }
        }
    }

    // Set movement directions
    for (let dir in keys) {
        if (keys.hasOwnProperty(dir)) {
            keys[dir].forEach((key) => {
                if (keyIsDown(key)) {
                    currentDirs[dir] = true;
                }
            });
        }
    }

    // Send and reset movement directions
    client.sendMovement(currentDirs);
    currentDirs = new Dirs();

    // Update turret angle
    // I learned this from https://stackoverflow.com/questions/2676719/calculating-the-angle-between-the-line-defined-by-two-points
    let angle = atan2(mouseY - player.pos.y, mouseX - player.pos.x);
    client.sendGunAngle(angle);

}

function mousePressed() {
    client.shoot();
}