import Paddle from '../prefabs/paddle';
import Ball from '../prefabs/ball';
import Ennemi from '../prefabs/ennemi';


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
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    ];

    for (let y = 0; y < tabBrick.length; y++) {
      let ligne = tabBrick[y];
      for (let x = 0; x < ligne.length; x++) {
        let caz = ligne[x];
        (caz == 1) ? this.createBrick(y, x) : '';
      }
    }

    this.paddle = new Paddle(this.game, (this.game.world.width) / 2, (this.game.world.height - 42));
    this.ball = new Ball(this.game, this.paddle.x - 8, this.paddle.body.y - 16);


    this.lives = 5;
    this.livesText = this.game.add.text(25, this.game.height - 30, 'vies: ' + this.lives, { font: "20px Arial", fill: "#ffffff", align: "left" });
    this.score = this.game.global.score;

    this.scoreText = this.game.add.text(this.game.width / 2, this.game.height - 30, 'score: ' + this.score, { font: "20px Arial", fill: "#ffffff", align: "left" });

    this.ball.events.onOutOfBounds.add(this.ballLost, this);
  }


  createBrick(y, x) {
    var brick;
    if (y < 2) {
      brick = this.bricks.create(30 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + '2' + '_1.png');
    } else if (2 <= y && y < 4) {
      brick = this.bricks.create(30 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + '3' + '_1.png');
    } else if (4 <= y && y < 6) {
      brick = this.bricks.create(30 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + '4' + '_1.png');
    } else {
      brick = this.bricks.create(30 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + '1' + '_1.png');
    }

    brick.body.bounce.set(1);
    brick.body.immovable = true;
  }

  releaseBall(velocityX, velocityY) {
    velocityX = velocityX || -100;
    velocityY = velocityY || -400;
    this.ball.start(velocityX, velocityY);
  }

  createEnnemies(nbEnnemis) {
    this.ennemies = [];
    var ceGame = this.game;
    this.nbEnnemis = nbEnnemis;
    !nbEnnemis ? nbEnnemis = 2 : nbEnnemis;
    for (let i = 0; i < nbEnnemis; i++) {
      this.ennemies.push(new Ennemi(ceGame, (400 / (i + 1)), (150 + (i * 15))));
    }
  }

  update() {

    if (this.ball.ballOnPaddle) {
      this.ball.body.x = this.paddle.x - 8;
      this.ball.body.y = this.paddle.body.y - 16;
    }

    this.game.physics.arcade.collide(this.ball, this.paddle, this.ballHitPaddle, null, this);

    this.game.physics.arcade.collide(this.ball, this.bricks, this.ballHitBrick, null, this);

    for (let i = 0; i < this.nbEnnemis; i++) {
      this.game.physics.arcade.collide(this.ball, this.ennemies[i]);
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
    if(this.score >= 40 && !this.ennemies){
      this.createEnnemies(3);
    }
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
      _paddle.increaseSpeed(0.5);
      this.changeScore(3);
    }
  }
  ballHitBrick(_ball, _brick) {
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


  endGame() {
    this.game.global.score = this.score;
    this.ennemies = !this.ennemies;
    this.game.state.start('gameover');
  }

}

export default Game;
