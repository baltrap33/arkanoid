class Paddle extends Phaser.Sprite {
  constructor(game, x, y, frame) {
    super(game, x, y, 'paddle', frame);

    // set size
    this.width = 35;
    this.scale.set(1.3);
    this.scale.y = Math.abs(this.scale.x);
    this.anchor.setTo(0.5, 0.5);

    this.speed = 7;
    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.bounce.set(1);
    this.body.immovable = true;
    this.game.add.existing(this);

    this.inter = null;
  }

  setSpeed (speed){
    speed = speed || 7;
    this.speed = speed;
  }

  increaseSpeed (px){
    this.speed += px;
  }

  update() {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      this.goLeft();
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      this.goRight();
    }
  }

  goLeft() {
    this.x -= this.speed;
  }
  goRight() {
    this.x += this.speed;
  }

  beBigger(){
    var me = this;
    this.inter = setTimeout(function(){
      me.beNormal();
    }, 10000);
    this.scale.set(2);
  }

  beNormal(){
    this.scale.set(1.6);
  }

  activateBonus(nameBonus){
    switch(nameBonus){
      case 'bigPaddle' : this.beBigger(); break;
    }
  }
 }
 export default Paddle;
