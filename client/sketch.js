var socket;

class Keys {
    constructor() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
    }

}

var dirKeys = new Keys();

var currentPlayer = {
    // id: socket.id,
    x: 0,
    y: 0,
    dirKeys: {
        left: false,
        right: false,
        up: false,
        down: false
    },
    // vel: new Velocity(0, 0)
};

var otherPlayers = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);

    socket = io.connect();

    // socket.on('mouse', (data) => {
    //     fill(0, 0, 255);
    //     noStroke();
    //     ellipse(data.x, data.y, 80, 80);
    // });

    socket.on('clear', () => {
        background(0);
    });

    socket.on('serverTellPlayerMove', (loc) => {
        fill(255);
        // ellipse(loc.x, loc.y, 80, 80);
        currentPlayer.x = loc.x;
        currentPlayer.y = loc.y;
    });

    socket.on('updateOtherPlayers', (data) => {
        otherPlayers = data;
    });
}

function draw() {
    // background(0);

    dirKeys = new Keys();

    ellipse(currentPlayer.x, currentPlayer.y, 80, 80);
    console.log(currentPlayer.x + ", " + currentPlayer.y);


    if (keyIsDown(LEFT_ARROW)) {
        dirKeys.left = true;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        dirKeys.right = true;
    }
    if (keyIsDown(UP_ARROW)) {
        dirKeys.up = true;
    }
    if (keyIsDown(DOWN_ARROW)) {
        dirKeys.down = true;
    }

    socket.emit('movePlayer', dirKeys);

    drawOtherPlayers();
}

function drawOtherPlayers() {
    for (var i = 0; i < otherPlayers.length; i++) {
        ellipse(otherPlayers[i].x, otherPlayers[i].y, 80, 80);
    };
}

// function mouseDragged() {
//     fill(0, 0, 255);
//     noStroke();
//     ellipse(mouseX, mouseY, 80, 80);
//
//     sendMouse(mouseX, mouseY);
// }
//
// function sendMouse(xpos, ypos) {
//     var data = {
//         x: xpos,
//         y: ypos
//     };
//     socket.emit('mouse', data);
// }
//
// function keyReleased() {
//     if (key === 'd' || key === 'D') {
//         background(0);
//         socket.emit('clear');
//     }
// }