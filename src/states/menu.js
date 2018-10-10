class Menu extends Phaser.State {

  constructor() {
    super();
  }

  create() {
    this.background = this.game.add.sprite(0, 0, 'sky');
    this.background.height = this.game.world.height;
    this.background.width = this.game.world.width;

    this.menuText = this.add.text(this.game.world.centerX, (this.game.world.height - 42), 'Click Enter to play', {
      font: '25px Arial', fill: '#ffffff', align: 'center'
    });
    this.menuText.anchor.set(0.5);
    this.canContinueToNextState = true;
  }

  update() { 
    if (this.input.keyboard.isDown(Phaser.Keyboard.ENTER) || this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      this.onInputDown();
    }
  }

  // create some cool tweens and apply them to 'this.ready' and 'this.go'
  onInputDown() {

    if (!this.canContinueToNextState) { // do not allow tweens to be created multiple times simultaneously
      return;
    }

    this.canContinueToNextState = false;
    this.menuText.visible = false;
    this.game.state.start('game');
  }

}

export default Menu;
