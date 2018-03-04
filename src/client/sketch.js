// A Player contains the following fields: {x, y, angle}

// let config = require('../../config.json');
// These will be hard-coded on clientside until i find a good way to import them from config.json
const WIDTH = 1500;
const HEIGHT = 700;


let world = {
    players: {}
};


world.updatePlayer = (playerData) => {
    if (playerData.id !== undefined) {
        world.players[playerData.id] = playerData;
    }
    // console.log(world.players);
};

world.removePlayer = (id) => {
    console.log(`Player removed: ${id}`);
    delete world.players[id];
};


function setup() {
    createCanvas(WIDTH, HEIGHT);
    background(0);

    client.addThisPlayer();
}

function draw() {
    background(0);
    let allPlayers = world.players;



    for (let p in allPlayers) {
        if (allPlayers.hasOwnProperty(p)) {
            fill(255);
            ellipse(allPlayers[p].x, allPlayers[p].y, 80, 80);
        }
    }



    if (keyIsDown(LEFT_ARROW)) {
        client.sendMovement('left');
    }
    if (keyIsDown(RIGHT_ARROW)) {
        client.sendMovement('right');
        // console.log('right');
    }
    if (keyIsDown(UP_ARROW)) {
        client.sendMovement('up');
    }
    if (keyIsDown(DOWN_ARROW)) {
        client.sendMovement('down');
    }


}