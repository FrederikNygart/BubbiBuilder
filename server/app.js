var express = require('express');
var path = require('path');
var app = express();
var serv = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.use(express.static(path.join(__dirname, '../public')));

serv.listen(2000);
console.log("Server started.");

var MAP_WIDTH = 50;
var MAP_HEIGHT = 50;

//Require and instantiate 
var Game = require("./model/Game.js");
var game = new Game(MAP_WIDTH, MAP_HEIGHT);

//All sockets listening to the server
var SOCKET_LIST = {};

onPlayerConnect = function (socket, player) {
    socket.emit('init', {
        player: game.getAllPlayerInitPacks(),
        bullet: game.getAllWeaponInitPacks(),
        tileMap: game.getTileMap().getMap()
    });
    notifyAllSockets(socket, player);
};

notifyAllSockets = function(socket, player){
    for (var i in SOCKET_LIST) {
        if(SOCKET_LIST[i]===socket){
        } else{
            SOCKET_LIST[i].emit('playerAdded', {
            player: player.getInitPack()
            });
        }
    }
}

onPlayerDisconnect = function (socket) {
    var player = game.getPlayerBySocketId(socket.id);
    game.removePlayer(player.socketID);
    //Packaging removal pack
    removePack.player.push(player.getRemovePack());
}

var DEBUG = true;

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    var player = game.addPlayer(socket.id);
    // initPack.player.push(player.getInitPack());
    onPlayerConnect(socket, player);
    console.log("Player connected.");

    socket.on('disconnect', function () {
        onPlayerDisconnect(socket);
        delete SOCKET_LIST[socket.id];
        console.log("Player disconnected.");
    });
    socket.on('sendMsgToServer', function (data) {
        var playerName = ("" + socket.id).slice(2, 7);
        for (var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data);
        }
    });

    socket.on('evalServer', function (data) {
        if (!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer', res);
    });

    socket.on('keyPress', function (data) {
        if (data.inputId === 'left')
            player.pressingLeft = data.state;
        else if (data.inputId === 'right')
            player.pressingRight = data.state;
        else if (data.inputId === 'up')
            player.pressingUp = data.state;
        else if (data.inputId === 'down')
            player.pressingDown = data.state;
        else if (data.inputId === 'attack')
            player.pressingAttack = data.state;
        else if (data.inputId === 'mouseAngle')
            player.mouseAngle = data.state;
    });

    /**
     * mapUpdate contains an update in the form:
     * {
     *  x: tile x value,
     *  y: tile y value,
     *  value: <new value of the tile, e.g., 0 for grass and 1 for stone>
     * }
     */
    socket.on('changeMap', function (mapUpdate) {
        game.getTileMap().updateTile(mapUpdate.x, mapUpdate.y, mapUpdate.value);
        for (var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('updateTileMap', { tileMap: game.getTileMap().getMap() });
        }
    });
});


//Setting up packages for init, removal and gameOver packs
var initPack = { player: [], bullet: [], objective: [] };
var removePack = { player: [], bullet: [] };
var gameOverPack = { objective: [] };

setInterval(function () {
    if (!game.gameOver) {
        //Packaging update pack
        game.updateGame();
        var pack = {
            player: game.getAllPlayerUpdatePacks(),
            bullet: game.getAllWeaponUpdatePacks(),
            objective: game.getAllObjectiveUpdatePacks()
        };

        //sending all packs
        for (var i in SOCKET_LIST) {
            var socket = SOCKET_LIST[i];
            // socket.emit('init', initPack);
            socket.emit('update', pack);
            socket.emit('remove', removePack);

        }

        //clearing the init and removal packs as these are not local variables
        initPack.player = [];
        initPack.bullet = [];
        removePack.player = [];
        removePack.bullet = [];
    } else if (game.gameOver) {
        var takenObjective = game.getTakenObjective();
        gameOverPack.objective.push(takenObjective.getGameOverPack());
        for (var i in SOCKET_LIST) {
            var socket = SOCKET_LIST[i];
            console.log("gameOverPack TEAM VAL: " + gameOverPack.objective[0].team + " and ACCOMPLISHED VAL: " + gameOverPack.objective[0].accomplished);
            socket.emit('gameOver', gameOverPack);
        }
        gameOverPack.objective = [];
    }
}, 1000 / 25);
