/*jshint esversion: 6 */
var IDhandler = require("./IDhandler.js");
var Weapon = require("./Weapon.js");
var Entity = require("./Entity.js");
var Team = require("./Team.js");


class Player {
    constructor(team, socketID){
        this.id = IDhandler.createRandomId();
        this.team = team;
        this.teamLabel = team.label;
        this.socketID = socketID;
        this.x = 690;
        this.y = 450;
        this.spdX = 0;
        this.spdY = 0;
        this.mouseAngle = 0;
        this.maxSpd = 10;
        this.hp = 10;
        this.hpMax = 10;
        this.score = 0;
        this.weapon = new Weapon(this, 0);
        this.attackOnCooldown = false;
        this.attackCooldownTimer = 0;
        
        //PLAYER ACTIONS
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.pressingAttack = false;
        this.pressingPlaceItem = false;
    }

    update() {
        this.updateSpd();
        this.move();
        if (this.pressingAttack && !this.attackOnCooldown) {
            this.attack(this.mouseAngle);
        }
        this.isAttackOnCooldown();
    }
    updateSpd() {
        if (this.pressingRight)
            this.spdX = this.maxSpd;
        else if (this.pressingLeft)
            this.spdX = -this.maxSpd;
        else
            this.spdX = 0;

        if (this.pressingUp)
            this.spdY = -this.maxSpd;
        else if (this.pressingDown)
            this.spdY = this.maxSpd;
        else
            this.spdY = 0;
    }
    move() {
        this.x += this.spdX;
        this.y += this.spdY;
    }
    attack(angle) {
        var weapon = new Weapon(this, angle);
        this.weapon = weapon;
        weapon.x = this.x;
        weapon.y = this.y;
        weapon.update();
    }

    isAttackOnCooldown(){
        if(this.pressingAttack && !this.attackOnCooldown){
            this.attackCooldownTimer = 50;
            this.attackOnCooldown = true;
            console.log("attack on cooldown");
        }
        else if(this.attackOnCooldown){
            this.attackCooldownTimer--; 
            if(this.attackCooldownTimer === 0){
                this.attackOnCooldown = false;
                console.log("attack cooldown ended");
            }           
        }else{
            //do nothing...
        }
    }

    onSameTeamAs(player){
        if (this.teamLabel === player.teamLabel){
            return true;
        }else{
            return false;
        }
    }

    respawn(){
        //Restores player health
        this.hp = this.hpMax;
        //spawn point after death
        this.x = Math.random() * 500;
        this.y = Math.random() * 500;
    }
    
    /************************************** 
                GETTERS AND SETTERS
     **************************************/

    getTeam(){
        return this.team;
    }

    getGame(){
        return this.getTeam().getGame();
    }

    getWeapon(){
        return this.weapon;
    }
    
    setPosition(x, y){
        setX(x);
        setY(y);
    }
    setX(x){
        this.x = x;
    }
    setY(y){
        this.y = y;
    }

    /************************************** 
                    PACK DATA
     **************************************/

    getInitPack(){
         return {
            id:         this.socketID,
            x:          this.x,
            y:          this.y,
            hp:         this.hp,
            hpMax:      this.hpMax,
            score:      this.score,
            team:       this.teamLabel,
        };
    }

    getUpdatePack(){
        return {
            id:         this.socketID,
            x:          this.x,
            y:          this.y,
            hp:         this.hp,
            score:      this.score,
            right:      this.pressingRight,
            left:       this.pressingLeft,
            down:       this.pressingDown,
            up:         this.pressingUp,
            attack:     this.pressingAttack
        };
    }

    getRemovePack(){
        return {
            id:         this.socketID
        }
    }

    /************************************** 
                    COLLISION
     **************************************/
    
    getDistance(pt) {
        return Math.sqrt(Math.pow(this.x - pt.x, 2) + Math.pow(this.y - pt.y, 2));
    }

    
}

module.exports = Player;