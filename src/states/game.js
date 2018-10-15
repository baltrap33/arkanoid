import Paddle from '../prefabs/paddle';
import Ball from '../prefabs/ball';

class Game extends Phaser.State {

  constructor() {
    super();
  }

  create() {

    this.background = this.game.add.sprite(0, 0, 'sky');
    this.background.height = this.game.world.height;
    this.background.width = this.game.world.width;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.checkCollision.down = false;


    this.bricks = this.game.add.group();
    this.bricks.enableBody = true;
    this.bricks.physicsBodyType = Phaser.Physics.ARCADE;
    var tabBrick = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    for (let y = 0; y < tabBrick.length; y++) {
      var lines = tabBrick[y];
      for (let x = 0; x < lines.length; x++) {
        (lines[x] == 1) ? this.createBricks(y, x) : '';
      }
    }


    this.paddle = new Paddle(this.game, (this.game.world.width) / 2, (this.game.world.height - 42));
    this.ball = new Ball(this.game, this.paddle.x - 8, this.paddle.body.y - 16);

    this.lives = 3;
    this.livesText = this.game.add.text(25, this.game.height - 30, 'vies: ' + this.lives, { font: "20px Arial", fill: "#ffffff", align: "left" });
    this.score = this.game.global.score;
    this.scoreText = this.game.add.text(this.game.width / 2, this.game.height - 30, 'score: ' + this.score, { font: "20px Arial", fill: "#ffffff", align: "left" });


    this.lazers = this.game.add.group();
    this.lazers.enableBody = true;
    this.lazers.physicsBodyType = Phaser.Physics.ARCADE;
    this.lazers.createMultiple(1000, 'bullet');
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.bulletTime = 0;

    this.ball.events.onOutOfBounds.add(this.ballLost, this);
  }
  createBricks(y, x) {
    var brick = this.bricks.create(30 + (x * 36), 100 + (y * 25), 'breakout', 'brick_4_1.png');
    brick.body.bounce.set(1);
    brick.body.immovable = true;
  }

  releaseBall(velocityX, velocityY) {
    velocityX = velocityX || -100;
    velocityY = velocityY || -400;
    this.ball.start(velocityX, velocityY);
  }

  update() {

    if (this.ball.ballOnPaddle) {
      this.ball.body.x = this.paddle.x - 8;
      this.ball.body.y = this.paddle.body.y - 16;
    }
    if (this.bricks.countLiving() == 0) {
      if (this.fireButton.isDown && !this.ball.ballOnPaddle) {


      }


    }




    this.game.physics.arcade.overlap(this.lazers, this.bricks, this.bulletHitBricks, null, this);
    //this.lazers.forEachAlive(this.updateBullets, this);


    this.game.physics.arcade.collide(this.ball, this.paddle, this.ballHitPaddle, null, this);

    this.game.physics.arcade.collide(this.ball, this.bricks, this.ballHitBrick, null, this);

    if ((this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) && this.ball.ballOnPaddle) {
      this.releaseBall();


    }
  }

  shootingBullet() {
    var tir = this;
    var spamShoot = setInterval(function () {
      tir.fireBullet();
    }, 75);
    this.inter = null;
    this.inter = setTimeout(function () {
      clearInterval(spamShoot);
    }, 5000)
  }
  fireBullet() {

    if (this.game.time.now > this.bulletTime) {
      let lazer;

      lazer = this.lazers.getFirstExists(false);


      if (lazer) {
        lazer.reset(this.paddle.x, this.paddle.y);
        lazer.body.velocity.y = -400;
        this.bulletTime = this.game.time.now + 200;
      }

    }
  }

  bulletHitBricks(lazer, bricks) {
    lazer.kill();
    bricks.kill();
    this.changeScore(30);

  }

  updateBullets(lazer) {
    lazer.kill();
  }
  ballLost() {
    this.ball.stop(this.paddle);
    this.paddle.setSpeed(7);
    this.lives -= 1;
    this.livesText.text = 'vies: ' + this.lives;
    if (this.lives === 0) {
      this.endGame();
    }
  }

  changeScore(pt) {
    this.score += pt;
    this.scoreText.text = 'score: ' + this.score;
  }

  ballHitPaddle(_ball, _paddle) {
    var diff = 0;
    if (_ball.x < _paddle.x) {
      diff = _paddle.x - _ball.x;
      _ball.body.velocity.x = (-10 * diff / 1.5);
    } else if (_ball.x > _paddle.x) {
      diff = _ball.x - _paddle.x;
      _ball.body.velocity.x = (10 * diff / 1.5);
    } else {
      _ball.body.velocity.x = 2 + Math.random() * 8;
    }
    if (!this.ball.ballOnPaddle) {
      _paddle.increaseSpeed(1.1);
      this.changeScore(10);
    }
  }
  ballHitBrick(_ball, _brick) {
    _brick.kill();
    this.changeScore(10);
    if (this.bricks.countLiving() == 0) {
      this.changeScore(1000);
      this.shootingBullet();
      this.lives += 1;
      this.ball.ballOnPaddle = true;
      this.ball.stop(this.paddle);
      this.bricks.callAll('revive');
    }
  }

  endGame() {
    this.game.global.score = this.score;
    this.game.state.start('gameover');
  }

}

export default Game;