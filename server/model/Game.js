/*jshint esversion: 6 */
var IDhandler = require("./IDhandler.js");
var Team = require("./Team.js");
var Player = require("./Player.js");
var Objective = require("./Objective.js");
var TileMap = require("./TileMap.js");

class Game{
    constructor(width, height){
        this.LOGGER = "Model.Game ";

        this.id = IDhandler.createRandomId();
        this.teams = [];
        this.gameOver = false;
        this.addTeams(this, 2);
        this.tileMap = new TileMap(width, height);
    }

    addTeam(team){
        this.teams.push(team);
    }

    addTeams(game, amountOfteams){
        for(var i = 0; i<amountOfteams; i++){
            var team = new Team(game, i+1);
            this.addTeam(team);
        }
    }

    addPlayer(socketID){
        var team = this.findSmallestTeam();
        var player = team.addPlayer(socketID);
        return player;
    }

    removePlayer(socketID){
        var players = this.getAllPlayers();
        for(var i = 0; i < players.length; i++){
            var player = players[i];
            if(socketID === player.socketID){
                player.getTeam().removePlayer(player);
                return true;
            }
        }
        console.log(this.LOGGER + "ERROR: Couldnt find player with socketID: " + socketID);
    }

    findSmallestTeam(){
        var smallestTeam;
        for(var i = 0; i<this.teams.length; i++){
            if(i===0){
                smallestTeam = this.teams[i];
            }else{
                if(this.teams[i].players.length < smallestTeam.players.length){
                    smallestTeam = this.teams[i];
                }
            }
        }
        return smallestTeam;
    }
    
    /************************************** 
                    GAME LOOP
     **************************************/

    /**
     * Calls all methods necessary to update the game
     */
    updateGame(){
        //Update state of objectives
        this.isObjectiveTaken();
        //Update if game is over 
        this.isOver();

        //check whether game is over
        if(!this.gameOver){
            //updates all players data
            this.updatePlayers();
        }
    }

    //update the data of all players
    updatePlayers(){
        var players = this.getAllPlayers();
        for(var i = 0; i < players.length; i++){
            var player = players[i];
            player.update();
        }
    }

    /**
     * Checks if each objective in each team by getting the teams objective
     * and checking if it has been taken by an opposing team's player
     */
    isObjectiveTaken(){
        //Get all players in game
        var players = this.getAllPlayers();
        //Go through each team in teams
        for(var i = 0; i < this.teams.length; i++){
            var team = this.teams[i];
            //Get the objective in each team
            var objective = team.objective;
            //Check if the objective have been taken by an opposing player
            for(var j = 0; j<players.length; j++){
                var player = players[j];
                objective.isTakenByEnemy(player);
            }
        }
    }

    /**
     * Updates if a game is over by checking 
     * if any objective have been taken by the enemy
     */
    isOver() {
        for (var i = 0; i < this.teams.length; i++) {
            var team = this.teams[i];
            var objective = team.getObjective();
            if (objective.takenByEnemy === true) {
                this.gameOver = true;
            }
        }
    }

    /************************************** 
                GETTERS AND SETTERS
     **************************************/
    
    getTeams(){
        return this.teams;
    }

    /**
     * Gets all objectives in game
     */
    getObjectives(){
        var allObjectives = [];
        for(var i = 0; i<this.teams.length;i++){
            allObjectives.push(this.teams[i].getObjective());
        }
        return allObjectives;
    }

    getTakenObjective(){
        for (var team in this.teams) {
            var objective = team.getObjective();
            if (objective.takenByEnemy === true) {
                return objective;
            } 
        }
        console.log(this.LOGGER + "ERROR! Game is over but no taken objective could be found")
    }

    /**
     * Gets all players in the game 
     */
    getAllPlayers(){
        var allPlayers = [];
        for(var i = 0; i < this.teams.length; i++){
            var team = this.teams[i];
            for(var j = 0; j < team.players.length; j++){
                var player = team.players[j];
                allPlayers.push(player);
            }
        }
        return allPlayers;
    }

    /**@OBS: NOT IMPLEMENTED
     * Gets all players on the opposing teams of a given team
     * @param the team which is given to find all opposing team players
     * @returns a list of all opposing team players
     */
    getPlayersOnOpposingTeamOf(team){
        var opposingTeams = [];
        var opposingTeamPlayers = [];
        for(var t in teams){
            if(t!==team){
                opposingTeams.push(t);
            }else{
                console.log(this.LOGGER + "WARNING! no opposing teams could be found")
            }
        }
        for(var i = 0; i < opposingTeams.length;i++){
            opposingTeamPlayers = opposingTeamPlayers
                                    .concat(opposingTeams[i].getPlayers());
        }
        return opposingTeamPlayers;
    }

    getTileMap() {
        return this.tileMap;
    }
    
    getPlayerBySocketId(socketID){
        var players = this.getAllPlayers();
        console.log("players: " + players.length);
        for(var i = 0; i < players.length ;i++){
            var player = players[i];
            if(player.socketID === socketID){
                return player;
            }
        }
        console.log(this.LOGGER + "WARNING! no player was found by the given id");
    }

    
    /************************************** 
                    PACK DATA
     **************************************/
    getAllPlayerInitPacks(){
        var allPlayerInitPacks = [];
        var players = this.getAllPlayers();
        for(var i = 0; i < players.length; i++){
            var player = players[i];
            console.log(this.LOGGER + "player init pack: " + player.getInitPack().id);
            allPlayerInitPacks.push(player.getInitPack());
        }
        return allPlayerInitPacks;
    }

    getAllWeaponInitPacks(){
        var allWeaponInitPacks = [];
        var players = this.getAllPlayers();
        for(var i = 0; i < players.length; i++){
            var player = players[i];
            allWeaponInitPacks.push(player.getWeapon().getInitPack());
        }
        return allWeaponInitPacks;
    }

    getAllPlayerUpdatePacks(){
        var allPlayerUpdatePacks = [];
        var players = this.getAllPlayers();
          for(var i = 0; i < players.length; i++){
            var player = players[i];
            allPlayerUpdatePacks.push(player.getUpdatePack());
        }
        return allPlayerUpdatePacks; 
    }

    getAllWeaponUpdatePacks(){
        var allWeaponUpdatePacks = [];
        var players = this.getAllPlayers();
        for(var i = 0; i < players.length; i++){
            var player = players[i];
            allWeaponUpdatePacks.push(player.getWeapon().getUpdatePack());
        }
        return allWeaponUpdatePacks;
    }

    getAllObjectiveUpdatePacks(){
        var allObjectiveUpdatePacks = [];
        var objectives = this.getObjectives();
        for(var i = 0; i < objectives.length; i++){
            var objective = objectives[i];
            allObjectiveUpdatePacks.push(objective.getUpdatePack());
        }
        return allObjectiveUpdatePacks;
    }

    getAllPlayerRemovePacks(){
        var allPlayerRemovePacks = [];
        var players = this.getAllPlayers();
        for(var i = 0; i < players.length; i++){
            var player = players[i];
            allPlayerRemovePacks.push(player.getRemovePack());
        }
        return allPlayerRemovePacks;
    }

}

module.exports = Game;