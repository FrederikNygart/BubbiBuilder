/*jshint esversion: 6 */
var IDhandler = require("./IDhandler.js");

class Entity {
    constructor(){
        this.id = IDhandler.createRandomId();
        this.x = 690;
        this.y = 450;
        this.spdX = 0;
        this.spdY = 0;
    }
    update() {
        this.updatePosition();
    }
    updatePosition() {
        this.x += this.spdX;
        this.y += this.spdY;
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
    getDistance(pt) {
        return Math.sqrt(Math.pow(this.x - pt.x, 2) + Math.pow(this.y - pt.y, 2));
    }
}

module.exports = Entity;