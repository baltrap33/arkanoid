class Preloader extends Phaser.State {

  constructor() {
    super();
    this.asset = null;
    this.ready = false;
  }
 
  preload() {
    // setup loading bar
    this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
    this.load.setPreloadSprite(this.asset);
 
    // setup loading and its events
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.loadResources();
  }
 
  loadResources() {
    this.game.load.atlas('breakout','assets/breakout.png','assets/breakout.json');
    this.game.load.image('sky', 'assets/starfield.jpg');
    this.game.load.image('paddle', 'assets/paddle.png');
 
    this.game.load.image('aimantPaddle', 'assets/Vaus_icon.png');
 
    this.game.load.image('ball', 'assets/ball.png');
  }
 
  onLoadComplete() {
    this.game.state.start('menu');
  }
 }
 
 export default Preloader;