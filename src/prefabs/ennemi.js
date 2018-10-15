class Ennemi extends Phaser.Sprite {
    constructor(game, x, y, frame) {
        
        super(game, x, y, 'breakout', 'paddle_big.png');

        // set size
        this.scale.set(1.5, 1.5);
        //this.anchor.set(0.5,0.5);

        this.speed = 4;
        this.CalcVelocity();
        
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.body.bounce.set(1);
        this.body.immovable = true;
        this.game.add.existing(this);

    }

    update() {
        this.calcCoord();
    }

    CalcVelocity(){
        let angle = Math.floor(Math.random() * 360);
        let radian = angle * Math.PI / 180;
        this.Vx = Math.cos(radian) * this.speed;
        this.Vy = Math.sin(radian) * this.speed;
    }
    
    calcCoord() {
        if (this.x + this.Vx < 0 + 5 || this.x + this.Vx > this.game.world.width - 70) {
            this.Vx = -this.Vx;
        }
        if (this.y + this.Vy < 150 || this.y + this.Vy > this.game.world.width - 70) {
            this.Vy = -this.Vy;
        }
        this.x += this.Vx;
        this.y += this.Vy;
    }

}

export default Ennemi;

