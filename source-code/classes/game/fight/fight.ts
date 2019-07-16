
import FightUpdateLoop from "./fight-update-loop";
import Fighter from "../fighter/fighter";
import { random } from "../../../helper-functions/helper-functions";
import ArenaDimensions from "../../../interfaces/game/fighter/arena-dimensions";


export default class Fight {
  fightUpdateLoop: FightUpdateLoop
  fighters: Fighter[]
  
  arenaDimensions: ArenaDimensions = {
    width: 600,
    height: 330,
    upFromBottom: 293,
    outFromLeft: 317
  }
  
  constructor(fighters: Fighter[]) {
    this.fighters = fighters
    //this.fighters.forEach((fighter: Fighter) => fighter.getPutInFight(this.arenaDimensions))
    this.fightUpdateLoop = new FightUpdateLoop(this)
  }

  getOtherFightersInFight(thisFighter: Fighter){
    return this.fighters.filter((fighter: Fighter) => fighter.name != thisFighter.name)
  }
  
  

  start(){
    //this.placeFighters()
    this.fightUpdateLoop.startLoop()
  }

  /* placeFighters(){
    
    this.fighters.forEach((fighter: Fighter) => {
      const modelHeight: number = fighterModelImages.find((image: FighterModelImage) => image.modelState == 'Idle').dimensions.height
      fighter.position.x = random(this.arenaDimensions.width) + this.arenaDimensions.outFromLeft
      fighter.position.y = random(this.arenaDimensions.height - modelHeight) + this.arenaDimensions.upFromBottom + modelHeight
    })
  } */


}