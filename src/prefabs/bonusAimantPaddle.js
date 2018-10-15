import Bonus from './bonus';


class BonusAimantPaddle extends Bonus {
   constructor(game, x, y, frame) {

       super(game, x, y, 'aimantPaddle', null);
       this.scale.set(0.25);
       this.type = "BonusAimantPaddle";
   }


   update() {
       this.y += 2;
   }

}


export default BonusAimantPaddle;