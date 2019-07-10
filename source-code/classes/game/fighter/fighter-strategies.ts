import Fighter from "./fighter";


export default interface IFighterStrategy{
  fighter: Fighter
  name: FighterStrategyName
  goal: string
  priority: number
  interuptable: boolean
  execute(): void
}

type FighterStrategyName = 
'Run away and recover' |
'Impatience' |
'Avoid crowds' |
'Safe to attack' |
'Backed into a corner' |
'Attack closest fighter' |
'Avoid boundary' |
'Avoid being flanked' |
'Smart defend' |
'Cheapshot' |
'Awarness' |
'Prey on the weak'

abstract class FighterStrategy implements IFighterStrategy{
  fighter: Fighter
  name: FighterStrategyName
  interuptable: true
  goal: string
  priority: number
  active: boolean
  constructor(fighter: Fighter){
    this.fighter = fighter
  }
  execute(): void {
    console.log(`${this.fighter.name} executing strategy "${this.name}"`);
  }
}

export class RunAwayAndRecover extends FighterStrategy{
  name: FighterStrategyName = 'Run away and recover'
  goal = 'When low on stamina, avoid fighting, try to find some distance and recover'

  constructor(fighter: Fighter){
    super(fighter)
  }

  get priority(): number {
    return 0
  }
  
  execute(): void {
    super.execute()
  }
}

export class Impatience extends FighterStrategy{
  name: FighterStrategyName = 'Impatience'
  goal = 'If full stamina and has not attacked in a while, move to attack'

  constructor(fighter: Fighter){
    super(fighter)
  }

  get priority(): number {
    return 0
  }
  
  execute(): void {
    super.execute()
  }
}



export class AttackClosestFighter extends FighterStrategy{
  name: FighterStrategyName = 'Attack closest fighter'
  goal = 'If full stamina and has not attacked in a while, move to attack'

  constructor(fighter: Fighter){
    super(fighter)
  }

  get priority(): number {
    return 1
  }
  
  execute(): void {
    super.execute()
    const closestFighter: Fighter = this.fighter.getClosestFighter()
    this.fighter.fighterTargetedForAttack = closestFighter
    if(closestFighter)
    switch(this.fighter.getFighterClosenessRating(closestFighter)){
      case 'Close' : {
        this.fighter.tryToHitFighter(this.fighter.fighterTargetedForAttack)
      }
      case 'Near' :
      case 'Far' : {
        this.fighter.moveTowardFighter(this.fighter.fighterTargetedForAttack)
      }
    }
  }

  


}



