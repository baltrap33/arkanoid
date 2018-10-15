class Bonus extends Phaser.Sprite {
    constructor(game, x, y, frame) {
        super(game, x, y, 'breakout', 'paddle_big.png');


        Phaser.TimerEvent.prototype.constructor = Phaser.TimerEvent;



        this.speed = 450;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        //this.animations.add('spin', ['brick5.png', 'brick4.png'], 50, true, false)
        this.game.add.existing(this);



    }
    

    stop(){
        if (this.bonusOnPaddle == true){
            console.log('toto');
        }
        setTimeout(function(){  }, 1000);
    }

    update() {
        this.y += 3;

    }

}






export default Bonus;


