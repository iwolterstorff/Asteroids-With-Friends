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

function submitInput() {
    name = nameBox.value();
    loginBox.hide();
    player = new Player(client.socket.id, nameBox.value(), colorInput.value());
    client.addThisPlayer(nameBox.value(), colorInput.value());
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
    missileImage = loadImage('/assets/PlayerMissile-hd.png');
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
                console.log(aPlayer.color);
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