/*jshint esversion: 6 */

class Player{
    constructor(initPack, playerImages){
        this.id = initPack.id;
        this.x = initPack.x;
        this.y = initPack.y;
        this.hp = initPack.hp;
        this.hpMax = initPack.hpMax;
        this.score = initPack.score;
        this.team = initPack.team;

        this.attack = false;

        this.movingRight = false;
        this.movingLeft = false;
        this.movingUp = false;
        this.movingDown = false;

        this.facingRight = true;
        this.facingLeft = false;
        this.facingUp = false;
        this.facingDown = false;

        this.playerImages = playerImages;

        // Initiate player image
        if(this.team === 1) {
            this.playerImage = this.playerImages.blue.idle.right;
        } else if (this.team === 2) {
            this.playerImage = this.playerImages.pink.idle.right;
        }
    }

    draw(context){
        this.drawPlayer(context);
        this.drawLifeBar(context);
        this.drawScore(context);
    }

    drawLifeBar(context){
        var hpWidth = 30 * this.hp / this.hpMax;
        context.fillRect(this.x - hpWidth / 6, this.y - 10, hpWidth, 4);
    }

    drawPlayer(context){
        this.getSprite(context);
        context.drawImage(this.playerImage, this.x, this.y);
    }

    drawScore(context){
        context.fillText(this.score, this.x + 5, this.y - 15);
    }

    getSprite(context){
        //Team blue
        if (this.team === 1) {
            if (!this.attack){
                if(this.movingRight){
                    this.playerImage = this.playerImages.blue.idle.right;
                    this.playerFacing("right");
                }
                else if(this.movingLeft){
                    this.playerImage = this.playerImages.blue.idle.left;
                    this.playerFacing("left");            
                }
                else if(this.movingDown){
                    this.playerImage = this.playerImages.blue.idle.down;
                    this.playerFacing("down");
                }
                else if(this.movingUp){
                    this.playerImage = this.playerImages.blue.idle.up;
                    this.playerFacing("up");
                }
            }
            else if(this.attack){
                if(this.facingRight || this.movingRight){
                    this.playerImage = this.playerImages.blue.attacking.right;
                }
                else if(this.facingLeft || this.movingLeft){
                    this.playerImage = this.playerImages.blue.attacking.left;
                }
                else if(this.facingDown || this.movingUp){
                    this.playerImage = this.playerImages.blue.attacking.down;
                }
                else if(this.facingUp || this.movingDown){
                    this.playerImage = this.playerImages.blue.attacking.up;
                }
            }
        } 
        //Team red
        else if (this.team === 2) {
            if (!this.attack){
                if(this.movingRight){
                    this.playerImage = this.playerImages.pink.idle.right;
                    this.playerFacing("right");                    
                }
                else if(this.movingLeft){
                    this.playerImage = this.playerImages.pink.idle.left;
                    this.playerFacing("left");
                }
                else if(this.movingDown){
                    this.playerImage = this.playerImages.pink.idle.down;
                    this.playerFacing("down");
                }
                else if(this.movingUp){
                    this.playerImage = this.playerImages.pink.idle.up;
                    this.playerFacing("up");
                }
            }
            else if(this.attack){
                if(this.facingRight || this.movingRight){
                    this.playerImage = this.playerImages.pink.attacking.right;
                }
                else if(this.facingLeft || this.movingRight){
                    this.playerImage = this.playerImages.pink.attacking.left;
                }
                else if(this.facingDown || this.movingRight){
                    this.playerImage = this.playerImages.pink.attacking.down;
                }
                else if(this.facingUp || this.movingRight){
                    this.playerImage = this.playerImages.pink.attacking.up;
                }
            }
        }
    }

    playerFacing(direction){
        if(direction === "right"){
            this.facingRight = true;
            this.facingLeft = false;
            this.facingUp = false;
            this.facingDown = false;
        }
        else if(direction === "left"){
            this.facingRight = false;
            this.facingLeft = true;
            this.facingUp = false;
            this.facingDown = false;
        }
        else if(direction === "up"){
            this.facingRight = false;
            this.facingLeft = false;
            this.facingUp = true;
            this.facingDown = false;
        }
        else if(direction === "down"){
            this.facingRight = false;
            this.facingLeft = false;
            this.facingUp = false;
            this.facingDown = true;
        }
    }

    getById(id){
        if(this.id === id){
            return this;
        }
    }
}

module.exports = Player;