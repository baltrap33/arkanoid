import Paddle from '../prefabs/paddle';
import Ball from '../prefabs/ball';
import BonusBigPaddle from '../prefabs/bonusBigPaddle';
import BonusAimantPaddle from '../prefabs/bonusAimantPaddle';

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
    var wall = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];


    for (let y = 0; y < wall.length; y++) {
      var lines = wall[y];
      for (let x = 0; x < lines.length; x++) {
        (lines[x] == 1) ? (this.createBrick1(x, y)) : '';
        (lines[x] == 2) ? (this.createBrick2(x, y)) : '';
        (lines[x] == 3) ? (this.createBrick3(x, y)) : '';
        (lines[x] == 4) ? (this.createBrick4(x, y)) : '';
      }
    }

    this.bonuses = [];
    this.paddle = new Paddle(this.game, (this.game.world.width) / 2, (this.game.world.height - 42));
    this.ball = new Ball(this.game, this.paddle.x - 8, this.paddle.body.y - 16);

    this.lives = 3;
    this.livesText = this.game.add.text(25, this.game.height - 30, 'vies: ' + this.lives, { font: "20px Arial", fill: "#ffffff", align: "left" });
    this.score = this.game.global.score;
    this.scoreText = this.game.add.text(this.game.width / 2, this.game.height - 30, 'score: ' + this.score, { font: "20px Arial", fill: "#ffffff", align: "left" });

    this.ball.events.onOutOfBounds.add(this.ballLost, this);
  }


  createBrick1(x, y) {
    var brick = this.bricks.create(30 + (x * 36), 100 + (y * 15), 'breakout', 'brick_1_1.png');
    brick.body.bounce.set(1);
    brick.body.immovable = true;
  }
  createBrick2(x, y) {
    var brick = this.bricks.create(30 + (x * 36), 100 + (y * 15), 'breakout', 'brick_2_1.png');
    brick.body.bounce.set(1);
    brick.body.immovable = true;
  }
  createBrick3(x, y) {
    var brick = this.bricks.create(30 + (x * 36), 100 + (y * 15), 'breakout', 'brick_3_1.png');
    brick.body.bounce.set(1);
    brick.body.immovable = true;
  }
  createBrick4(x, y) {
    var brick = this.bricks.create(30 + (x * 36), 100 + (y * 15), 'breakout', 'brick_4_1.png');
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

    this.game.physics.arcade.collide(this.ball, this.paddle, this.ballHitPaddle, null, this);

    this.game.physics.arcade.collide(this.ball, this.bricks, this.ballHitBrick, null, this);

    for (let i = 0; i < this.bonuses.length; i++) {
      this.game.physics.arcade.collide(this.paddle, this.bonuses[i], this.bonusHitPaddle, null, this);
    }
    if ((this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) && this.ball.ballOnPaddle) {
      this.releaseBall();
    }
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


    if (_ball.ballTouchPaddle) {
      _ball.ballOnPaddle = true;
    }


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
      _paddle.increaseSpeed(0.5);
      this.changeScore(3);
    }
  }

  ballHitBrick(_ball, _brick) {
    var bonus;
    let randomise = Math.floor(Math.random() * 50) < 5;
    if (randomise) {
      let randomise2 = Math.floor(Math.random() * 50) < 25;
      bonus = randomise2 ? new BonusAimantPaddle(this.game, _brick.x, _brick.y) : new BonusBigPaddle(this.game, _brick.x, _brick.y);
      this.bonuses.push(bonus);
    }
    _brick.kill();
    this.changeScore(10);
    if (this.bricks.countLiving() == 0) {
      this.changeScore(1000);
      this.lives += 1;
      this.ball.ballOnPaddle = true;
      this.ball.stop(this.paddle);
      this.bricks.callAll('revive');
    }
  }

  bonusHitPaddle(_paddle, _bonus) {
    let type = _bonus.getType();
    switch (type) {
      case 'BonusBigPaddle': _paddle.activateBonus('bigPaddle'); break;
      case 'BonusAimantPaddle': this.ball.activateBonus('balleAimant'); break;
    }
    _bonus.destroy();
  }

  /*
  bonusStayOnPaddle(_paddle, _bonus){
    ballOnPaddle.body.immovable = true;
  }
 
 
  // this.bonus.bonusOnPaddle = true;
*/

  endGame() {
    this.game.global.score = this.score;
    this.game.state.start('gameover');
  }

}

export default Game;
