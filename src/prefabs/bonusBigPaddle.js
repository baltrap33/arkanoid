   import Bonus from './bonus';
   
   
   class BonusBigPaddle extends Bonus {
      constructor(game, x, y, frame) {
          super(game, x, y, 'breakout', 'paddle_big.png');
          this.type = "BonusBigPaddle";
      }
   
      update() {
          this.y += 2;
      }
   
   }
   
   
   export default BonusBigPaddle;