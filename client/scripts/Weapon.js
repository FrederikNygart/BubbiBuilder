/*jshint esversion: 6 */

class Weapon{
    constructor(initPack){
        this.id = initPack.id;
        this.x = initPack.x;
        this.y = initPack.y;
    }
}

module.exports = Weapon;