class Paddle extends Phaser.Sprite {
    constructor(game, x, y, frame) {
      super(game, x, y, 'paddle', frame);
  
      // set size
      this.width = 35;
      this.scale.y = Math.abs(this.scale.x);
      this.x = (this.game.world.width)/2 - this.scale.x/2;
      this.y = (this.game.world.height - 42);
      this.anchor.setTo(0.5, 0.5);
    }
  
    update() {
      //this.x = this.game.input.mousePointer.x;
      //this.y = this.game.input.mousePointer.y;
      if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        this.goLeft();
      }
      if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        this.goRight();
      }
    }

    goLeft(){
      if (this.x <= (this.width/2)){

      }else{
        this.x -= 5;
      }
    }
    goRight(){
      if(this.x >= (this.game.world.width - (this.width/2)) ){

      }else{
        this.x += 5;
      }
      
    }
  }
  
  export default Paddle;
  