// This file is basically an enumeration of everything a client can do (that would be broadcast)

let client = {};

client.socket = io.connect();

///// SENDING DATA //////////////////

client.addThisPlayer = () => {
    client.socket.emit('newPlayer');
};

// dir is one of: ['up', 'down', 'left', 'right']
client.sendMovement = (dir) => {
    client.socket.emit('playerMove', dir);
};

// angle is in RADIANS
client.sendGunAngle = (angle) => {
    client.socket.emit('playerMoveGun', {angle: angle});
};

client.shoot = () => {
    client.socket.emit('playerShoot');
};


//// RECEIVING DATA ////////////////

// A Player contains the following fields: {posn: {x, y}, angle}

client.socket.on('newPlayer', (data) => {
    world.updatePlayer(data);
});

client.socket.on('allPlayers', (data) => {
   // for (let playerIndex = 0; playerIndex < data.length; playerIndex += 1) {
   //     world.updatePlayer(data[playerIndex]);
   // }
    data.forEach((player, index, array) => {
        world.updatePlayer(player);
    });


   client.socket.on('remove', (id) => {
       world.removePlayer(id);
   });
});