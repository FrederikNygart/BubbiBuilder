/*jshint esversion: 6 */
var IDhandler = require("./IDhandler.js");
var Entity = require("./Entity.js");
var Player = require("./Player.js");

class Weapon {
    constructor(player, angle){
        this.id = IDhandler.createRandomId();
        this.x = 690;
        this.y = 450;
        this.spdX = Math.cos(angle / 180 * Math.PI) * 10;
        this.spdY = Math.sin(angle / 180 * Math.PI) * 10;
        this.player = player;
        this.timer = 0;
        this.toRemove = false;
    }
    
    updatePosition() {
        this.x = this.player.x;
        this.y = this.player.y;
    }

    update() {
        if (this.timer++ > 0){
            this.toRemove = true;
        }
        this.updatePosition();

        var allPlayers = this.getGame().getAllPlayers();
        var attacker = this.player;
        //Checks each player for collision with weapon
        for (var p = 0; p < allPlayers.length; p++) {
            /** Weapon collides with player if 
             * player is closer than 32(px) && 
             * player is not the shooter && 
             * it is not one of the players teammates
            */
            var target = allPlayers[p];
            if (this.getDistance(target) < 32 && attacker !== target && !attacker.onSameTeamAs(target)) {
                target.hp -= 1;
                if (target.hp <= 0) {
                    if (attacker) {
                        attacker.score += 1;
                    }
                   target.respawn();
                }
                //Sets weapon to be removed after impact
                this.toRemove = true;
            }
        }
    }
    
    /************************************** 
                GETTERS AND SETTERS
     **************************************/
    getPlayer(){
        return this.player;
    }

    getGame(){
        return this.getPlayer().getGame();
    }


    /************************************** 
                    PACK DATA
     **************************************/

    getInitPack(){
         return {
            id:         this.id,
            x:          this.x,
            y:          this.y
        };
    }

    getUpdatePack(){
        return {
            id:         this.id,
            x:          this.x,
            y:          this.y        
        };
    }

    /************************************** 
                    COLLISION
     **************************************/

    getDistance(pt) {
        return Math.sqrt(Math.pow(this.x - pt.x, 2) + Math.pow(this.y - pt.y, 2));
    }

    
}

module.exports = Weapon;
