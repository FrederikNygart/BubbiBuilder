/*jshint esversion: 6 */
var IDhandler = require("./IDhandler.js");
var Entity = require("./Entity.js");

/**
 * Objective is the class that decides the goal or "objective" of the game
 */
class Objective {
    constructor(team){
        this.id = IDhandler.createRandomId();
        this.team = team;
        this.takenByEnemy = false;
        this.x = 0;
        this.y = 0;

        // Tile variables
        this.TILE_HEIGHT = 18;
        this.TILE_WIDTH = 18;
        this.MAP_OFFSET_X = 690;
        this.MAP_OFFSET_Y = 74;

    }

    /**
     * Updates relevant data for the class before data is packaged
     */
    update() {
        for (var i in Player.list) {
            this.takenByEnemy(Player.list[i]);
        }
    }


    /**
     * Decides the position of the objective on the map
     */
    placeObjective() {
        if (this.team === 1) {
            this.x = 14;
            this.y = 1;
        } else if (this.team === 2) {
            this.x = 14;
            this.y = 37;
        }
    }

    onSameTeamAs(player){
        if(player.getTeam() === this.getTeam()){
            return true;
        }else{
            return false;
        }
    }
    
    /**
     * Evaluates if an objective has been reached by the enemy
     */
    isTakenByEnemy(player) {
        if (this.getDistance(player) < 32 && !this.onSameTeamAs(player)) {
            this.takenByEnemy = true;
        }
    }

    /************************************** 
                GETTERS AND SETTERS
     **************************************/

    getTeam(){
        return this.team;
    }

    setX(x){
        this.x = x;
    }
    setY(y){
        this.y = y;
    }
    setPosition(x, y){
        setX(x);
        setY(y);
    }


    /************************************** 
                    PACK DATA
     **************************************/

    getInitPack(){
         return {
            id:             this.id,
            socketID:       this.socketID,
            x:              this.x,
            y:              this.y,
            hp:             this.hp,
            hpMax:          this.hpMax,
            score:          this.score,
            team:           this.team,
        };
    }

    getUpdatePack(){
        return {
            takenByEnemy:   this.takenByEnemy
        };
    }

    getGameOverPack() {
        return {
            team:           this.team.label,
            takenByEnemy:   this.takenByEnemy
        }
    }

    /************************************** 
                    COLLISION
     **************************************/
    
    /**
     * Gets distance from the Objective to another "point" with help 
     * from offsets
     */
    getDistance(pt) {
        var x = (this.x - this.y) * this.TILE_HEIGHT + this.MAP_OFFSET_X;
        var y = (this.x + this.y) * this.TILE_HEIGHT / 2 + this.MAP_OFFSET_Y;
        return Math.sqrt(Math.pow(x - pt.x, 2) + Math.pow(y - pt.y, 2));
    }

}
module.exports = Objective;
