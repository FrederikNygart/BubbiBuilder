/*jshint esversion: 6 */
var IDhandler = require("./IDhandler.js");
var Player = require("./Player.js");
var Objective = require("./Objective.js");


class Team {
    constructor(game, label){
        this.id = IDhandler.createRandomId();
        this.game = game;
        this.label = label;
        this.players = [];
        this.objective = new Objective(this);
    }

    addPlayer(socketID){
        var player = new Player(this, socketID);
        this.players.push(player);
        return player;
    }

    removePlayer(player){
        if(this.has(player)){
            this.players.splice(this.players.indexOf(player),1);
        }else{
            console.log("ERROR! Team.removePlayer was not executed");
        }
    }

    isOnSameTeamAs(player) {
        for (i = 0; i < this.players.length; i++) {
            if (player.id === this.players[i].id) {
                return true;
            }
        }
        return false;
    }
    
    has(player){
        var players = this.getPlayers();
        for(var i = 0; i < players.length; i++){
            var playerOnTeam = players[i];           
            if(player===playerOnTeam){
                return true;
            }
        }
        console.log("WARNING! Team.has(player) was false")
        return false;
    }

    /************************************** 
                GETTERS AND SETTERS
     **************************************/
    
    setObjective(objective){
        this.objective = objective;
    }
    getPlayers(){
        return this.players;
    }
    getObjective(){
        return this.objective;
    }
    getGame(){
        return this.game;
    }

    
}

module.exports = Team;