
(function() {
    /**
     * IMPORTS
     */
    var Socket = require("socket.io-client");
    var Objective = require("./Objective.js");
    var IsometricHelper = require("./IsometricHelper.js");
    var Sprite = require("./Sprite");
    var GraphicsLoader = require("./GraphicsLoader");
    var Decoration = require("./Decoration");
    var Structure = require("./Structure");
    var Player = require("./Player");

    // Canvas
    var CANVAS_WIDTH = 1280;
    var CANVAS_HEIGHT = 720;

    // Tile variables
    var TILE_WIDTH = 36;
    var TILE_HEIGHT = 18;

    // Used to shift drawn tiles to 0,0. Assumes even dimensions.
    var TILE_WIDTH_HALF = TILE_WIDTH / 2;

    // Tile map
    var MAP_WIDTH;
    var MAP_HEIGHT;
    var MAP_OFFSET_X = 720;
    var MAP_OFFSET_Y = 50;

    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.font = '30px Arial';
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    document.body.appendChild(canvas);

    var windowWidht = window.innerWidth;
    var windowHeight = window.innerHeight;

    var chatText = document.getElementById('chat-text');
    var chatInput = document.getElementById('chat-input');
    var chatForm = document.getElementById('chat-form');

    // Images to be loaded and used
    var images = [];

    var canvasPosition = {
        x: 0,
        y: 0
    };
    var prevX;
    var prevY;
    var tileSet = true;

    // Objective images
    var objectiveBlueImage = new Image();
    objectiveBlueImage.src = "./images/objectives/objectiveBlue/objectiveBlue.png";
    images.push(objectiveBlueImage);

    var objectivePinkImage = new Image();
    objectivePinkImage.src = "images/objectives/objectivePink/objectivePink.png";
    images.push(objectivePinkImage);

    // Player images; pink/blue: walkingfront, walkingleft, walkingright, walkingback, swordfront, swordright, swordleft
    // Player sprites blue
    var playerWalkingFrontBlueImage = new Image();
    playerWalkingFrontBlueImage.src = 'images/playerSprites/playerBlue/walkingFrontSpriteBlue.png';
    images.push(playerWalkingFrontBlueImage);

    var playerWalkingRightBlueImage = new Image();
    playerWalkingRightBlueImage.src = 'images/playerSprites/playerBlue/walkingRightSpriteBlue.png';
    images.push(playerWalkingRightBlueImage);

    var playerWalkingLeftBlueImage = new Image();
    playerWalkingLeftBlueImage.src = 'images/playerSprites/playerBlue/walkingLeftSpriteBlue.png';
    images.push(playerWalkingLeftBlueImage);

    var playerWalkingBackBlueImage = new Image();
    playerWalkingBackBlueImage.src = 'images/playerSprites/playerBlue/walkingBackSpriteBlue.png';
    images.push(playerWalkingBackBlueImage);

    var playerSwordFrontBlueImage = new Image();
    playerSwordFrontBlueImage.src = 'images/playerSprites/playerBlue/swordFrontSpriteBlue.png';
    images.push(playerSwordFrontBlueImage);

    var playerSwordRightBlueImage = new Image();
    playerSwordRightBlueImage.src = 'images/playerSprites/playerBlue/swordRightSpriteBlue.png';
    images.push(playerSwordRightBlueImage);

    var playerSwordLeftBlueImage = new Image();
    playerSwordLeftBlueImage.src = 'images/playerSprites/playerBlue/swordLeftSpriteBlue.png';
    images.push(playerSwordLeftBlueImage);

    // Player sprites pink
    var playerWalkingFrontPinkImage = new Image();
    playerWalkingFrontPinkImage.src = 'images/playerSprites/playerPink/walkingFrontSpritePink.png';
    images.push(playerWalkingFrontPinkImage);

    var playerWalkingRightPinkImage = new Image();
    playerWalkingRightPinkImage.src = 'images/playerSprites/playerPink/walkingRightSpritePink.png';
    images.push(playerWalkingRightPinkImage);

    var playerWalkingLeftPinkImage = new Image();
    playerWalkingLeftPinkImage.src = 'images/playerSprites/playerPink/walkingLeftSpritePink.png';
    images.push(playerWalkingLeftPinkImage);

    var playerWalkingBackPinkImage = new Image();
    playerWalkingBackPinkImage.src = 'images/playerSprites/playerPink/walkingBackSpritepink.png';
    images.push(playerWalkingBackPinkImage);

    var playerSwordFrontPinkImage = new Image();
    playerSwordFrontPinkImage.src = 'images/playerSprites/playerPink/swordFrontSpritePink.png';
    images.push(playerSwordFrontPinkImage);

    var playerSwordRightPinkImage = new Image();
    playerSwordRightPinkImage.src = 'images/playerSprites/playerPink/swordRightSpritePink.png';
    images.push(playerSwordRightPinkImage);

    var playerSwordLeftPinkImage = new Image();
    playerSwordLeftPinkImage.src = 'images/playerSprites/playerPink/swordLeftSpritePink.png';
    images.push(playerSwordLeftPinkImage);

    var playerImages = {
        blue: {
            attacking:{
                right: playerSwordRightBlueImage,
                left: playerSwordLeftBlueImage,
                up: playerWalkingBackBlueImage,
                down: playerSwordFrontBlueImage
            },
            idle: {
                right: playerWalkingRightBlueImage,
                left: playerWalkingLeftBlueImage,
                up: playerWalkingBackBlueImage,
                down: playerWalkingFrontBlueImage
            }
        },
        pink: {
            attacking:{
                right:playerSwordRightPinkImage,
                left:playerSwordLeftPinkImage,
                up:playerWalkingBackPinkImage,
                down: playerSwordFrontPinkImage
            },
            idle: {
                right:playerWalkingRightPinkImage,
                left:playerWalkingLeftPinkImage,
                up:playerWalkingBackPinkImage,
                down: playerWalkingFrontPinkImage
            }
        }
    };

    // Tile images
    var tileGrassImage = new Image();
    tileGrassImage.src = 'images/tiles/tileGrass.png';
    images.push(tileGrassImage);

    // Structure images
    var structureStoneWallImage = new Image();
    structureStoneWallImage.src = "images/structures/structureStoneWall.png";
    images.push(structureStoneWallImage);

    // UI images; title
    var titleBubbiBuilderImage = new Image();
    titleBubbiBuilderImage.src = 'images/ui/titleBubbiBuilder.png';
    images.push(titleBubbiBuilderImage);

    // Decoration images
    var blueObjectiveSpinnerImage = new Image();
    blueObjectiveSpinnerImage.src = "images/objectives/objectiveBlue/objectiveSpinnerBlue.png";
    images.push(blueObjectiveSpinnerImage);

    var pinkObjectiveSpinnerImage = new Image();
    pinkObjectiveSpinnerImage.src = "images/objectives/objectivePink/objectiveSpinnerPink.png";
    images.push(pinkObjectiveSpinnerImage);

    // Load all images and start init if all images are loaded
    GraphicsLoader.loadImages(images, init);

    var clientId;
    var losingTeam;
    var gameOver = false;

    // TODO: Consider integration with serverside gameloop
    function gameLoop() {
        window.requestAnimationFrame(gameLoop);
        targetBlue.update();
        targetBlue.render();
        targetPink.update();
        targetPink.render();
    }

    var targetPink;
    var targetPinkPoint = IsometricHelper
    .tileToCanvas(14, 37, MAP_OFFSET_X, MAP_OFFSET_Y, TILE_WIDTH, TILE_HEIGHT);
    var targetBlue;
    var targetBluePoint = IsometricHelper
    .tileToCanvas(14, 1, MAP_OFFSET_X, MAP_OFFSET_Y, TILE_WIDTH, TILE_HEIGHT);

    // Add Event Listener to dectect when page has fully loaded.
    // window.addEventListener('load', init, false);

    // Two Dimensional Array storing our isometric map layout. Each number represents a tile.
    var map = [];

    var tileGraphics = [];

    var blueObjective;
    var pinkObjective;

    function init() {
        targetPink = Sprite({
            ticksPerFrame: 2,
            numberOfFrames: 10,
            context: ctx,
            width: 360,
            height: 36,
            image: pinkObjectiveSpinnerImage,
            x: targetPinkPoint.x - TILE_WIDTH_HALF,
            y: targetPinkPoint.y - 15
        });
        targetBlue = Sprite({
            ticksPerFrame: 2,
            numberOfFrames: 10,
            context: ctx,
            width: 360,
            height: 36,
            image: blueObjectiveSpinnerImage,
            x: targetBluePoint.x - TILE_WIDTH_HALF,
            y: targetBluePoint.y - 15
        });

        blueObjective = new Objective(14, 1, objectiveBlueImage, 1);
        pinkObjective = new Objective(14, 37, objectivePinkImage, 1);

        renderHud();
        drawObjectives();
        socketio();
        gameLoop();
    }

    // Render HUD
    function renderHud(hp, maxHp, team) {
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.font = "15px arial";
        ctx.textAlign = "left";
        ctx.textBaseLine = "top";
        ctx.fillText("Playername", 10, 15);
        ctx.fillText("Health: " + hp + '/' + maxHp, 110, 15);
        ctx.fillText("Resources: 50", 230, 15);
        if (team === 1) {
            ctx.fillText("Team Blue", 350, 15);
        } else if (team === 2) {
            ctx.fillText("Team Pink", 350, 15);
        }

    }

    function drawObjectives() {
        var canvasPoint = IsometricHelper.tileToCanvas(blueObjective.x, blueObjective.y, MAP_OFFSET_X, MAP_OFFSET_Y, TILE_WIDTH, TILE_HEIGHT);
        ctx.drawImage(blueObjective.image, canvasPoint.x - TILE_WIDTH_HALF, canvasPoint.y);
        var canvasPointPink = IsometricHelper.tileToCanvas(pinkObjective.x, pinkObjective.y, MAP_OFFSET_X, MAP_OFFSET_Y, TILE_WIDTH, TILE_HEIGHT);
        ctx.drawImage(pinkObjective.image, canvasPointPink.x - TILE_WIDTH_HALF, canvasPointPink.y);
    }

    function onImagesLoaded() {
        drawMap();
        gameLoop();

    // Images to be loaded and used.
    }

    function drawMap() {
        var drawTile;
        var canvasPoint;

        if (map) {
            // loop through our map and draw out the base tiles
            for (var i = 0; i < map.length; i++) {
                for (var j = 0; j < map[i].length; j++) {
                    drawTile = map[i][j];
                    canvasPoint = IsometricHelper.tileToCanvas(i, j, MAP_OFFSET_X, MAP_OFFSET_Y, TILE_WIDTH, TILE_HEIGHT);
                    // Draw the represented image number, at the desired X & Y coordinates followed by the graphic width and height.
                    ctx.drawImage(tileGrassImage, canvasPoint.x - TILE_WIDTH_HALF, canvasPoint.y);
                }
            }
            // loop through our map and draw stone tiles
            for (var k = 0; k < map.length; k++) {
                for (var l = 0; l < map[k].length; l++) {
                    drawTile = map[k][l];
                    canvasPoint = IsometricHelper.tileToCanvas(k, l, MAP_OFFSET_X, MAP_OFFSET_Y, TILE_WIDTH, TILE_HEIGHT);
                    if (drawTile === 1) {
                        // Draw at clicked tile regardless of image height
                        ctx.drawImage(structureStoneWallImage, canvasPoint.x - TILE_WIDTH_HALF, canvasPoint.y - structureStoneWallImage.height + TILE_HEIGHT);
                    }
                }
            }
        }
    }

    function drawHighlight() {
        if (tileSet) {
            ctx.beginPath();
            ctx.moveTo(canvasPosition.x, canvasPosition.y);
            ctx.lineTo(canvasPosition.x + TILE_WIDTH / 2, canvasPosition.y + TILE_HEIGHT / 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(canvasPosition.x - TILE_WIDTH / 2, canvasPosition.y + TILE_HEIGHT / 2);
            ctx.lineTo(canvasPosition.x, canvasPosition.y);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(canvasPosition.x + TILE_WIDTH / 2, canvasPosition.y + TILE_HEIGHT / 2);
        ctx.lineTo(canvasPosition.x, canvasPosition.y + TILE_HEIGHT);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvasPosition.x, canvasPosition.y + TILE_HEIGHT);
        ctx.lineTo(canvasPosition.x - TILE_WIDTH / 2, canvasPosition.y + TILE_HEIGHT / 2);
        ctx.stroke();
    }

    function saveLastMousePosition(x, y) {
        prevX = x;
        prevY = y;
    }

    /**
     * Draws the text "Game Over" in the middle of the screen
     */
    function drawGameOver(team) {
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.font = "50px arial";
        ctx.textAlign = "center";
        ctx.textBaseLine = "top";
        if (team === 1) {
            ctx.fillText("Game Over", windowWidht / 2, windowHeight / 2);
            ctx.fillStyle = "rgb(255,159,151)";
            ctx.fillText("pink", windowWidht / 2 - 50, windowHeight / 2 + 50);
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillText("won", windowWidht / 2 + 60, windowHeight / 2 + 50);
        } else if (team === 2) {
            ctx.fillText("Game Over", windowWidht / 2, windowHeight / 2);
            ctx.fillStyle = "rgb(0,64,123)";
            ctx.fillText("blue", windowWidht / 2 - 50, windowHeight / 2 + 50);
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillText("won", windowWidht / 2 + 60, windowHeight / 2 + 50);
        }
    }

    function socketio() {
        var socket = Socket.connect('Localhost:2000');

        // Chat
        var chatText = document.getElementById('chat-text');
        var chatInput = document.getElementById('chat-input');
        var chatForm = document.getElementById('chat-form');

        var players = [];
 
        socket.on('addToChat', function (data) {
            chatText.innerHTML += '<div>' + data + '</div>';
        });
        socket.on('evalAnswer', function(data) {
        });

        chatForm.onsubmit = function(e) {
            e.preventDefault();
            if (chatInput.value[0] === '/')
                socket.emit('evalServer', chatInput.value.slice(1));
            else
                socket.emit('sendMsgToServer', chatInput.value);
            chatInput.value = '';
        };

        socket.on('init', function (data) {
            if(data.tileMap){
                map = data.tileMap;
                MAP_WIDTH = map.length;
                MAP_HEIGHT = map[0].length;
            }
            //{ player : [{id:123,number:'1',x:0,y:0},{id:1,number:'2',x:0,y:0}]}
            for (var i = 0; i < data.player.length; i++) {
                var player = new Player(data.player[i], playerImages);
                players.push(player);
            }
        });

        socket.on('playerAdded', function(data){
            var player = new Player(data.player, playerImages);
            players.push(player);
        });

        socket.on('update', function (data) {
            //{ player : [{id:123,x:0,y:0},{id:1,x:0,y:0}]}
            var player = null;
            for (var i = 0; i < data.player.length; i++) {
                var playerPack = data.player[i];
                for (var p = 0; p < players.length; p++){
                    ply = players[p].getById(playerPack.id);
                        if (ply !== undefined)
                            player = ply;
                }
                if (player) {
                    if (playerPack.x !== undefined)
                        player.x = playerPack.x;
                    if (playerPack.y !== undefined)
                        player.y = playerPack.y;
                    if (playerPack.hp !== undefined)
                        player.hp = playerPack.hp;
                    if (playerPack.score !== undefined)
                        player.score = playerPack.score;
                    if (playerPack.right !== undefined)
                        player.movingRight = playerPack.right;
                    if (playerPack.left !== undefined)
                        player.movingLeft = playerPack.left;
                    if (playerPack.up !== undefined)
                        player.movingUp = playerPack.up;
                    if (playerPack.down !== undefined)
                        player.movingDown = playerPack.down;
                    if (playerPack.attack !== undefined)
                        player.attack = playerPack.attack;
                }
            }
        });

        socket.on('remove', function(data) {
            //{player:[12323],bullet:[12323,123123]}
            var player = null;
            for (var i = 0; i < data.player.length; i++) {
                var playerPack = data.player[i];
                for (var p = 0; p < players.length; p++){
                    ply = players[p].getById(playerPack.id);
                        if (ply !== undefined)
                            player = ply;
                }
            }
            if(player){
                players.splice(players.indexOf(player),1);
            }
        });

        socket.on('gameOver', function (data) {
            losingTeam = data.objective[0].team;
            gameOver = data.objective[0].accomplished;
        });

        socket.on('updateTileMap', function(data) {
            map = data.tileMap;
        });

        setInterval(function() {
            if (gameOver) {
                //Clear all that has been drawn previously
                ctx.clearRect(0, 0, 1280, 720);
                //Draw a new map
                drawMap();
                //Draw objectives
                drawObjectives();
                //Draw game over message
                drawGameOver(losingTeam);
            } else if (!gameOver) {
                //Clear all that has been drawn previously
                ctx.clearRect(0, 0, 1280, 720);
                //Draw a new map
                drawMap();
                drawHighlight();
                //Draw objectives
                drawObjectives();
                //Draw all players 
                for (var i = 0; i < players.length; i++){
                    players[i].draw(ctx);
                }
            }
        }, 40);


        document.onkeydown = function(event) {
            if (event.keyCode === 68)    //d
                socket.emit('keyPress', { inputId: 'right', state: true });
            else if (event.keyCode === 83)   //s
                socket.emit('keyPress', { inputId: 'down', state: true });
            else if (event.keyCode === 65) //a
                socket.emit('keyPress', { inputId: 'left', state: true });
            else if (event.keyCode === 87) // w
                socket.emit('keyPress', { inputId: 'up', state: true });

        };

        document.onkeyup = function(event) {
            if (event.keyCode === 68)    //d
                socket.emit('keyPress', { inputId: 'right', state: false });
            else if (event.keyCode === 83)   //s
                socket.emit('keyPress', { inputId: 'down', state: false });
            else if (event.keyCode === 65) //a
                socket.emit('keyPress', { inputId: 'left', state: false });
            else if (event.keyCode === 87) // w
                socket.emit('keyPress', { inputId: 'up', state: false });
        };

        document.onmousedown = function(event) {
            socket.emit('keyPress', { inputId: 'attack', state: true });
        };

        document.onmouseup = function(event) {
            socket.emit('keyPress', { inputId: 'attack', state: false });
        };

        document.onmousemove = function(event) {
            var x = -250 + event.clientX - 8;
            var y = -250 + event.clientY - 8;
            var angle = Math.atan2(y, x) / Math.PI * 180;
            socket.emit('keyPress', { inputId: 'mouseAngle', state: angle });
        };

        document.oncontextmenu = function(event) {
            // Prevent default browser right click context menu
            event.preventDefault();

            // Get clicked tile
            var rect = canvas.getBoundingClientRect();
            var tile = IsometricHelper.canvasToTile(event.clientX - rect.left, event.clientY - rect.top, MAP_OFFSET_X, MAP_OFFSET_Y, TILE_WIDTH, TILE_HEIGHT);
            var mapChange = {
                x: tile.x,
                y: tile.y
            };
            // Toggle between grass and stone tile state
            if (map[tile.x][tile.y] === 0) {
                mapChange.value = 1;
            } else {
                mapChange.value = 0;
            }
            socket.emit('changeMap', mapChange);
        };

        document.onmousemove = function(event) {
            event.preventDefault();

            var rect = canvas.getBoundingClientRect();
            var tilePosition = IsometricHelper.canvasToTile(event.clientX - rect.left, event.clientY - rect.top, MAP_OFFSET_X, MAP_OFFSET_Y, TILE_WIDTH, TILE_HEIGHT);
            if ((tilePosition.x >= 0 && tilePosition.x < MAP_WIDTH) && (tilePosition.y >= 0 && tilePosition.y < MAP_HEIGHT)) {
                canvasPosition = IsometricHelper.tileToCanvas(tilePosition.x, tilePosition.y, MAP_OFFSET_X, MAP_OFFSET_Y, TILE_WIDTH, TILE_HEIGHT);
                if (tilePosition.x !== prevX || tilePosition.y !== prevY) {
                    if (map[tilePosition.x][tilePosition.y] === 0) {
                        tileSet = true;
                        drawHighlight();
                    } else {
                        tileSet = false;
                        drawHighlight();
                    }
                }
            }
            saveLastMousePosition(tilePosition.x, tilePosition.y);
        }
    };
})();