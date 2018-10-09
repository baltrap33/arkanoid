class Paddle extends Phaser.Sprite {
  constructor(game, x, y, frame) {
    super(game, x, y, 'paddle', frame);

    // set size
    this.width = 35;
    this.scale.set(1.3);
    this.scale.y = Math.abs(this.scale.x);
    this.anchor.setTo(0.5, 0.5);

    
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.bounce.set(1);
    this.body.immovable = true;
    this.game.add.existing(this);
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
    this.x -= 5;
  }
  goRight() {
    this.x += 5;
  }
}

export default Paddle;
