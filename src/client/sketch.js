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

let player;


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


function setup() {
    createCanvas(WIDTH, HEIGHT);
    background(0);

    client.addThisPlayer();

    currentDirs = new Dirs();

    keys = {
        up: [UP_ARROW, 87],
        down: [DOWN_ARROW, 83],
        left: [LEFT_ARROW, 65],
        right: [RIGHT_ARROW, 68]
    };

    player = {
        id: client.socket.id,
        x: WIDTH / 2,
        y: HEIGHT / 2,
        radius: DEFRADIUS,
        angle: 0,
        missiles: []
    };
}

function draw() {
    background(0);
    let allPlayers = world.players;

    // Render spaceships with turrets
    for (let p in allPlayers) {
        if (allPlayers.hasOwnProperty(p)) {
            fill(255);
            let aPlayer = allPlayers[p];
            ellipse(aPlayer.x, aPlayer.y, aPlayer.radius * 2, aPlayer.radius * 2);
            push();
            translate(aPlayer.x, aPlayer.y);
            rotate(aPlayer.angle);
            line(0, 0, aPlayer.radius, 0);
            pop();
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

    player.missiles.forEach((item, index, array) => {
        push();
        translate(item.x, item.y);
        rotate(item.angle + (PI / 2));
        fill(192, 192, 192);
        triangle(-10, 30, 10, 30, 0, 0);
        pop();
    });

    // Send and reset movement directions
    client.sendMovement(currentDirs);
    currentDirs = new Dirs();

    // Update turret angle
    // I learned this from https://stackoverflow.com/questions/2676719/calculating-the-angle-between-the-line-defined-by-two-points
    let angle = atan2(mouseY - player.y, mouseX - player.x);
    client.sendGunAngle(angle);

}

function mousePressed() {
    client.shoot();
}