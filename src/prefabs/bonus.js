class Bonus extends Phaser.Sprite {
    constructor(game, x, y, key, frame) {
        super(game, x, y, key , frame);
 
 
        this.speed = 450;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.game.add.existing(this);
    }
    getType(){
        let type = this.type;
        if (!type){
            throw console.error('NO BONUS TYPE');
        }
        return type;
    }
    update(){
        this.y += 3;
    }
 
 }
 
 
 export default Bonus;