// This file is basically an enumeration of everything a client can do (that would be broadcast)

let client = {};

client.socket = io.connect();

///// SENDING DATA //////////////////

client.addThisPlayer = (name, color) => {
    client.socket.emit('newPlayer', {
        name: name,
        color: color
    });
};

client.sendMovement = (dirs) => {
    client.socket.emit('playerMove', dirs);
};

// angle is in RADIANS
client.sendGunAngle = (angle) => {
    client.socket.emit('playerMoveGun', angle);
};

client.shoot = () => {
    client.socket.emit('playerShoot');
};


//// RECEIVING DATA ////////////////

// A Player contains the following fields: {posn: {x, y}, angle}

client.socket.on('newPlayer', (data) => {
    world.updatePlayer(data);
});

client.socket.on('leaderboard', (data) => {
    updateLeaderboard(data);
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