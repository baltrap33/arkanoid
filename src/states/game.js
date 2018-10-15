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
    var brick;
    /*for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 15; x++) {
        brick = this.bricks.create(30 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y + 1) + '_1.png');
        brick.body.bounce.set(1);
        brick.body.immovable = true;
      }
    }*/
    var tabBrick = [[1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1],
    [0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0],
    [1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1]];


    for (let i = 0; i < tabBrick.length; i++) {
      var ligne = tabBrick[i]
      for (let l = 0; l < ligne.length; l++) {
        var nb = ligne[l];
        if (nb === 1) {
          brick = this.bricks.create(10 + (l * 36), 100 + (i * 52), 'breakout', 'brick_' + '1' + '_1.png');
          brick.body.bounce.set(1);
          brick.body.immovable = true;
        }
      }
    }


    this.paddle = new Paddle(this.game, (this.game.world.width) / 2, (this.game.world.height - 42));


    this.createBalls();
    //this.ball = new Ball(this.game, this.paddle.x - 8, this.paddle.body.y - 16);

    this.lives = 3;
    this.livesText = this.game.add.text(25, this.game.height - 30, 'vies: ' + this.lives, { font: "20px Arial", fill: "#ffffff", align: "left" });
    this.score = this.game.global.score;
    this.countScore = 0;
    this.countModeEtoile = 0;
    this.scoreText = this.game.add.text(this.game.width / 2, this.game.height - 30, 'score: ' + this.score, { font: "20px Arial", fill: "#ffffff", align: "left" });
    this.compteRebour = this.game.add.text(this.game.width / 2, 10, ' ', { font: "20px Arial", fill: "#ffffff", align: "left" });

    this.modeEtoile();

  }
  createBalls() {
    this.tabBall = [];

    for (let i = 0; i < 1; i++) {
      let ball = new Ball(this.game, this.paddle.x - 8, this.paddle.body.y - 16);
      ball.idGame = (new Date()).getTime();
      this.tabBall.push(ball);
      console.log(ball);
      ball.events.onOutOfBounds.add(this.ballLost, this);
      
      
    }
  }
  lanceBonus() {
    for (let i = 0; i < 2; i++) {
      let ball = new Ball(this.game, this.paddle.x - 8, this.paddle.body.y - 16);
      ball.idGame = (new Date()).getTime();
      console.log(ball);
      this.tabBall.push(ball);
      ball.speed = 450;

      ball.events.onOutOfBounds.add(this.ballLost, this);
    }
    //console.log('bonus');
    //console.log(this.tabBall)
  }
  
  modeEtoile() {
    var me = this;
    setInterval(function interval() {
      console.log('bonus');
      for (let i = 0; i <= 10; i++) {
        setTimeout(function () {
          me.compteRebour.text = 'invincible : ' + me.time;
          console.log(me.time);
          return me.time -= 1;
        }, 1000 * i);
        me.time = 10;
      }
      me.game.physics.arcade.checkCollision.down = true;
      setTimeout(function () {
        console.log('fin bonus');
        me.compteRebour.text = '';
        me.game.physics.arcade.checkCollision.down = false;
        for(let x = 0; x < me.tabBall.length; x++){
          var ball = me.tabBall[x];
          ball.baisseVitesse();
        }
      }, 11000);
      for(let j = 0; j < me.tabBall.length; j++){
        var ball = me.tabBall[j];
        ball.changeVitesse();
      }
    }, 20000);
    
    //return collisionDown = false;


  }
  releaseBall(ball, velocityX, velocityY) {
    velocityX = velocityX || -100;
    velocityY = velocityY || -400;
    ball.start(velocityX, velocityY);
  }

  update() {
    for (let i = 0; i < this.tabBall.length; i++) {
      let ball = this.tabBall[i];
      if (ball.ballOnPaddle) {
        ball.body.x = this.paddle.x - 8;
        ball.body.y = this.paddle.body.y - 16;
      }
      this.game.physics.arcade.collide(ball, this.paddle, this.ballHitPaddle, null, this);

      this.game.physics.arcade.collide(ball, this.bricks, this.ballHitBrick, null, this);

      if ((this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) && ball.ballOnPaddle) {
        this.releaseBall(ball);
      }

    }



  }

  ballLost(_ball) {
    if (this.tabBall.length > 1) {
      let idGame = _ball.idGame;
      let ballIndex = this.tabBall.findIndex(function (el) {
        return el.idGame === idGame;
      });
      _ball.destroy();
      this.tabBall.splice(ballIndex, 1);
      console.log(this.tabBall);
      //this.tabBall.map(function (_ball, i) {
      //_ball.idGame = i;
      //});
      return
    }
    _ball.stop(this.paddle);
    this.paddle.setSpeed(7);
    this.lives -= 1;
    this.livesText.text = 'vies: ' + this.lives;
    if (this.lives === 0) {
      this.endGame();
    }
  }
  

  changeScore(pt) {

    this.countScore += pt;
    this.countModeEtoile += pt;

    this.score += pt;
    this.scoreText.text = 'score: ' + this.score;

    //console.log(this.countScore);
    //console.log(this.score);
    if (this.countScore >= 200) {
      this.lanceBonus();
      return this.countScore = 0;
    }
    //if(this.countModeEtoile >= 500){
    //  this.modeEtoile();
    //  return this.countModeEtoile = 0;
    //}


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
    if (!_ball.ballOnPaddle) {
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
      _ball.ballOnPaddle = true;
      _ball.stop(this.paddle);
      this.bricks.callAll('revive');
      
      
      

      
      
    }
  }

  endGame() {
    this.game.global.score = this.score;
    this.game.state.start('gameover');
  }

}

export default Game;
