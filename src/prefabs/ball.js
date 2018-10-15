class Ball extends Phaser.Sprite {
    constructor(game, x, y, frame) {

        super(game, x, y, 'breakout', 'ball_1.png');

        // set size
        this.scale.set(1.1);
        this.anchor.set(0.5);
        // speed 400 easy // 750 hard
        this.speed = 450;

        this.checkWorldBounds = true;
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.body.bounce.set(1);

        this.animations.add('spin', ['ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png'], 50, true, false);
        this.game.add.existing(this);
        this.ballOnPaddle = true;
    }

    start(vX, vY) {
        if (this.ballOnPaddle) {
            let angle = 250 + Math.floor(Math.random() * 40);
            let radian = angle * Math.PI / 180;
            this.ballOnPaddle = false;
            this.body.velocity.y = Math.sin(radian) * this.speed;
            this.body.velocity.x = Math.cos(radian) * this.speed;
            this.animations.play('spin');
        }
    }
    changeVelocity() {
        let angle = 250 + Math.floor(Math.random() * 40);
        let radian = angle * Math.PI / 180;
        this.body.velocity.y = Math.sin(radian) * this.speed;
        this.body.velocity.x = Math.cos(radian) * this.speed;
    }
    stop(paddle) {
        if (!this.ballOnPaddle) {
            this.reset(paddle.x + 16, paddle.y - 16);
            this.ballOnPaddle = true;
            this.animations.stop();
        }
    }
    balleAimant() {
        var me = this;
        this.inter = setTimeout(function () {
            me.balleNonAimant();
        }, 10000);

        this.ballTouchPaddle = true;
    }

    balleNonAimant() {
        this.ballTouchPaddle = false;
    }

    activateBonus(nameBonus) {
        switch (nameBonus) {
            case 'balleAimant': this.balleAimant(); break;
        }
    }

    update() {

    }
}

export default Ball;
