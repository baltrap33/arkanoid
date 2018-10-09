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
 
    this.paddle = new Paddle(this.game, (this.game.world.width) / 2, (this.game.world.height - 42));
    this.ball = new Ball(this.game, (this.game.world.width) / 2, this.paddle.y - 16);

    this.lives = 3; 
    this.livesText = this.game.add.text(25, this.game.height - 30, 'vies: '+this.lives, { font: "20px Arial", fill: "#ffffff", align: "left" });
    this.score = this.game.global.score;
    this.scoreText = this.game.add.text(this.game.width/2, this.game.height - 30, 'score: '+this.score, { font: "20px Arial", fill: "#ffffff", align: "left" });

    this.ball.events.onOutOfBounds.add(this.ballLost, this);
  }

  releaseBall(velocityX, velocityY) {
    velocityX = velocityX || -75;
    velocityY = velocityY || -300;
    this.ball.start(velocityX, velocityY);
  }

  update() {
    
    if (this.ball.ballOnPaddle) {
      this.ball.body.x = this.paddle.x;
      this.ball.body.y = this.paddle.body.y - 16;
    }
    this.game.physics.arcade.collide(this.ball, this.paddle, this.ballHitPaddle, null, this);

    if ((this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) && this.ball.ballOnPaddle) {
      this.releaseBall();
    }
  }

  ballLost() {
    this.ball.stop(this.paddle);
    this.lives -= 1;
    this.livesText.text = 'vies: ' + this.lives;
    if (this.lives === 0){
      this.endGame();
    }
  }

  changeScore (pt){
    this.score += pt;
    this.scoreText.text = 'score: ' + this.score;
  }

  ballHitPaddle(_ball, _paddle) {
    var diff = 0;
    if (_ball.x < _paddle.x) {
        diff = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    } else if (_ball.x > _paddle.x) {
        diff = _ball.x -_paddle.x;
        _ball.body.velocity.x = (10 * diff);
    } else {
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }
    if (!this.ball.ballOnPaddle){
      this.changeScore(3);
    }
  }
  ballHitBrick(_ball, _brick) {

  }

  endGame() {
    this.game.global.score = this.score;
    this.game.state.start('gameover');
  }

}

export default Game;
