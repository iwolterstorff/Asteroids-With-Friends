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

let player, canvas, inputMessage, nameBox, colorInput, submitButton;

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

let currColor = '#ff0000';

function updateCurrColor(jscolor) {
    currColor = '#' + (jscolor.toString() || 'ff0000');
}

function submitInput() {
    name = nameBox.value();
    loginBox.hide();
    player = new Player(client.socket.id, nameBox.value(), currColor);
    client.addThisPlayer(nameBox.value(), currColor);
}

function resetInput() {
    nameBox.value('');
    inputMessage.show();
    nameBox.show();
    submitButton.show();
    canvas.hide();
}

let bg, playerImage, turretImage, surroundImage, missileImage;
let loginBox;
let leaderboardString = '';

// const newCenter = createVector(WIDTH / 2, HEIGHT / 2);
// const newZero = createVector(0, 0);

const Player = function(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.pos = { x: WIDTH / 2, y: HEIGHT / 2 };
    this.vel = { x: 0, y: 0 };
    this.radius = DEFRADIUS;
    this.angle = 0;
    this.missiles = [];
    this.health = 100;
    this.visible = true;
    this.score = 0;
};


function setup() {
    bg = loadImage('/assets/backg.png');
    playerImage = loadImage('/assets/Cannon-hd.png');
    // turretImage = loadImage('/assets/Turret-hd.png');
    surroundImage = loadImage('/assets/surround-desat.png');
    turretImage = loadImage('/assets/turret.png');
    missileImage = loadImage('/assets/missile-desat.png');
    canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent('game-canvas');
    background(bg);
    loginBox = select('#login-box');
    nameBox = select('#player-name');
    colorInput = select('#player-color');
    submitButton = select('#submit-button');

    // canvas.hide();

    // inputMessage = createElement('h2', 'What\'s your name?');
    // nameBox = createInput('');
    // submitButton = createButton('submit');
    // submitButton.mousePressed(submitInput);

    currentDirs = new Dirs();

    // dummy player
    player = new Player(client.socket.id, null, null);

    // client.addThisPlayer();

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
            if (aPlayer.id === player.id) {
                player = aPlayer;

                push();
                textFont('Raleway');
                textSize(25);
                fill(255, 215, 0);
                text('Your score:\n' + aPlayer.score, 10, 20);
                // text(aPlayer.score, 10, 20);
                pop();

                // "glow" highlight effect
                // adapted this snippet from https://stackoverflow.com/questions/20959489/how-to-draw-a-glowing-halo-around-elements-using-processing-2-0-java
                // let glowRadius = 100.0 + 15 * sin(frameCount/(3 * frameRate()) * TWO_PI);
                let glowRadius = 100.0;
                strokeWeight(2);
                fill(255, 0);
                push();
                translate(aPlayer.pos.x, aPlayer.pos.y);
                for (let rad = 0; rad < glowRadius; rad += 1) {
                    // stroke(255.0, 215.0, 0.0, 255.0 * (1 - rad / glowRadius));
                    if (aPlayer.health > 25) {
                        stroke(34.0, 255.0, 0.0, 255.0 * (1 - rad / glowRadius));
                    } else {
                        stroke(240.0, 0.0, 1.1, 255.0 * (1 - rad / glowRadius));
                    }
                    ellipse(0, 0, rad, rad);
                }
                pop();
                // console.log(aPlayer.name);
            }
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

                // draw player name
                push();
                textFont('Raleway');
                textAlign(CENTER, CENTER);
                fill(255, 215, 0);
                textSize(15);
                textStyle(BOLD);
                text(aPlayer.name, 0, aPlayer.radius + 17);
                pop();
            }


            push();
            rotate(aPlayer.angle + (PI / 2));
            // line(0, 0, aPlayer.radius, 0);
            imageMode(CENTER);
            if (aPlayer.visible) {
                image(turretImage, 0, 0, aPlayer.radius * 2, aPlayer.radius * 2);
                // console.log(aPlayer.color);
                // tint(aPlayer.color, 207);
                tint(color(aPlayer.color), 190);
                image(surroundImage, 0, 0, aPlayer.radius * 2, aPlayer.radius * 2);
                noTint();
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
                tint(color(aPlayer.color), 190);
                image(missileImage, 0, 0);
                noTint();
                pop();
            });

            push();
            fill(255, 0);
            stroke(255, 215, 0);
            strokeWeight(2);
            let rectWidth = textWidth(leaderboardString);
            let rectHeight = 35 * (Object.keys(allPlayers).length + 2) + 10;
            console.log(rectHeight);
            rect(WIDTH - rectWidth, 0, rectWidth, rectHeight, 20);
            textFont('Raleway');
            textSize(17);
            textAlign(CENTER);
            textStyle(NORMAL);
            text(leaderboardString, WIDTH - rectWidth, 0, rectWidth, rectHeight);
            pop();


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

function updateLeaderboard(str) {
    leaderboardString = str;
}

