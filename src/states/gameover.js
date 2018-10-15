class Menu extends Phaser.State {

  constructor() {
    super();
  }

  create() {
    // add background image
    this.background = this.game.add.sprite(0,0,'sky');
    this.background.height = this.game.world.height;
    this.background.width = this.game.world.width;

    // add intro text
    this.gameoverText = this.add.text(this.game.world.x+150,this.game.world.y+250, "GAME OVER !!!! ",{
      font: '42px Arial', fill: '#ffffff', align: 'center'
    });
    this.gameoverText = this.add.text(this.game.world.centerX,this.game.world.centerY, "Score = "+this.game.global.score +"points", {
      font: '42px Arial', fill: '#ffffff', align: 'center'
    });
    this.gameoverText.anchor.set(0.5);

    // prevent accidental click-thru by not allowing state transition for a short time
    this.canContinueToNextState = false;
    this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function(){ this.canContinueToNextState = true; }, this);

    this.saveVarsToLocalStorage();
    this.resetGlobalVariables();
  }

  saveVarsToLocalStorage() {
    const max = localStorage.maxScore || 0; //default value of 0 is it does not exist
    if (this.game.global.score > max) {
      localStorage.maxScore = this.game.global.score;
    }
    this.gameoverText = this.add.text(this.game.world.x +125,this.game.world.y +50, "Meilleur score : "+localStorage.maxScore+" points", {fill :'#ffffff'})
  }

  resetGlobalVariables() {
    this.game.global.score = 0;
  }

  update() {
    if (this.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
      this.onInputDown();
    }
  }

  onInputDown() {
    if(this.canContinueToNextState){
      this.game.state.start('menu');
    }
  }

}

export default Menu;
