// A Player contains the following fields: {x, y, angle}

// let config = require('../../config.json');
// These will be hard-coded on clientside until i find a good way to import them from config.json
const WIDTH = 1500;
const HEIGHT = 700;


let world = {
    players: {}
};


world.updatePlayer = (playerData) => {
    world.players[playerData.id] = playerData;
};

world.removePlayer = (id) => {
    delete world.players[id];
};


function setup() {
    createCanvas(WIDTH, HEIGHT);
    background(0);

    client.addThisPlayer();
}

function draw() {
    background(0);

    // dirKeys = {
    //     left: false,
    //     right: false,
    //     up: false,
    //     down: false
    // };

    // for (let player in world.players) {
    //     fill(255);
    //     let x, y;
    //     // default to 0 if x and y properties are not found
    //     // x = player.hasOwnProperty('x') ? player.x : 0;
    //     // y = player.hasOwnProperty('y') ? player.y : 0;
    //     ellipse(x, y, 80, 80);
    //     // console.log(`X ${x} Y ${y}`);
    // }

    for (let player in world.players) {
        if (world.players.hasOwnProperty(player)) {
            ellipse(player.x, player.y, 80, 80);
        }
    }

    // ellipse(currentPlayer.x, currentPlayer.y, 80, 80);
    // // TODO: Finish turret drawing logic
    // line(currentPlayer.x, currentPlayer.y,
    //     40 * Math.cos(currentPlayer.lineAngle),
    //     40 * Math.sin(currentPlayer.lineAngle));
    // // console.log(currentPlayer.x + ", " + currentPlayer.y);
    // console.log(40 * Math.cos(currentPlayer.lineAngle));
    // console.log(40 * Math.sin(currentPlayer.lineAngle));




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

    // https://stackoverflow.com/questions/2676719/calculating-the-angle-between-the-line-defined-by-two-points
    // var lineDeltax = mouseX - currentPlayer.x;
    // var lineDeltay = currentPlayer.y - mouseY;
    // // console.log(lineDeltay);
    // var angle = Math.atan2(lineDeltay, lineDeltax);
    // console.log(angle);

    // socket.emit('movePlayer', {
    //     keys: dirKeys,
    //     angle: angle
    // });

    // drawOtherPlayers();
}

// function drawOtherPlayers() {
//     for (var i = 0; i < otherPlayers.length; i++) {
//         ellipse(otherPlayers[i].x, otherPlayers[i].y, 80, 80);
//     }
// }





// var socket;
//
// class Keys {
//     constructor() {
//         this.left = false;
//         this.right = false;
//         this.up = false;
//         this.down = false;
//     }
//
// }
//
// var dirKeys = new Keys();
//
// var currentPlayer = {
//     // id: socket.id,
//     x: 0,
//     y: 0,
//     dirKeys: {
//         left: false,
//         right: false,
//         up: false,
//         down: false
//     },
//     lineAngle: 0
//     // vel: new Velocity(0, 0)
// };
//
// var otherPlayers = [];
//

//
