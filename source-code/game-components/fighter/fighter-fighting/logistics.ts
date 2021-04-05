import FighterFighting from "./fighter-fighting"
import { MoveAction } from "../../../types/figher/action-name"
import Fighter from "../fighter"
import { Closeness } from "../../../types/figher/closeness"

export default class Logistics {

  hadActionRecently: boolean
  justTurnedAround: boolean
  justDidAttack: boolean
  justBlocked: boolean
  justDodged: boolean
  justTookHit: boolean
  private _onARampage: boolean
  memoryOfEnemyBehind: Fighter
  moveActionInProgress: MoveAction
  directionAlongEdge: number


  constructor(public fighting: FighterFighting){}

  set onARampage(value: boolean){
    const {fighter} = this.fighting
    fighter.state.onARampage = value
  }

  get onARampage(): boolean{
    return this._onARampage
  }
  
  isARetreatInProgress(): boolean{

    const retreatActions: MoveAction[] = ['retreat', 'cautious retreat', 'fast retreat', 'retreat from flanked', 'reposition', 'retreat around edge']
    
    return retreatActions.some(moveAction => moveAction == this.moveActionInProgress)
  }


  



  enemyAttackingThisFighter(enemy: Fighter): boolean{
    const {name} = this.fighting.fighter
    const {enemyTargetedForAttack} = enemy.fighting
    return enemyTargetedForAttack && enemyTargetedForAttack.name == name
  }

  otherFightersStillFighting(): Fighter[]{
    return this.fighting.otherFightersInFight.filter(fighter => !fighter.fighting.knockedOut)
  }


  enemyIsAttackingOrDefending(enemy: Fighter){
    const {movement, animation} = enemy.fighting
    return (
      animation.inProgress == 'punching' || 
      animation.inProgress == 'critical striking' ||
      animation.inProgress == 'defending' ||
      movement.moveActionInProgress == 'cautious retreat'
    )
  }

  hasJustTurnedAround(): boolean{  
    return this.fighting.timers.activeTimers.some(timer => timer.name == 'just turned around')
  }

  hasLowStamina(): boolean{
    const {stamina, stats} = this.fighting
    return stamina < stats.maxStamina * .5
  }

  hasLowSpirit(): boolean{
    const {spirit, stats} = this.fighting
    return spirit < stats.maxSpirit * .5
  }

  hasFullStamina(): boolean{
    const {stamina, stats} = this.fighting
    return stamina == stats.maxStamina
  }
  hasFullSpirit(): boolean{
    const {spirit, stats} = this.fighting
    return spirit == stats.maxSpirit
  }


  enemyIsOnARampage(enemy: Fighter): boolean{
    return enemy.fighting.timers.activeTimers.some(timer => timer.name == 'on a rampage')
  }

  enemyHasLowSpirit(enemy: Fighter): boolean{
    const {spirit} = enemy.fighting
    const {maxSpirit} = enemy.fighting.stats
    return spirit < (maxSpirit / 2)
  }

  enemyHasLowStamina(enemy: Fighter): boolean{
    const {stamina} = enemy.fighting
    const {maxStamina} = enemy.fighting.stats
    return stamina < (maxStamina / 2)
  }

  isEnemyTargetingThisFighter(enemy: Fighter): boolean{
    const enemyTargeting = enemy.fighting.enemyTargetedForAttack
    const thisFighterName = this.fighting.fighter.name
    return enemyTargeting && enemyTargeting.name == thisFighterName
  }

  
  allOtherFightersAreKnockedOut(): boolean{
    return this.fighting.otherFightersInFight.every((fighter: Fighter) => fighter.fighting.knockedOut)
  } 
  

  hasRetreatOpportunity(enemy: Fighter): boolean{
    const enemyAction = enemy.fighting.animation.inProgress
    if(this.fighting.proximity.getEnemyCombatCloseness(enemy) != Closeness['striking range']){
      console.error('should used if enemy not in striking range');
      debugger
      return 
    }
    return (
      this.enemyJustAttacked(enemy) ||
      enemyAction == 'recovering' || 
      enemyAction == 'defending'
    )
  }

  enemyJustAttacked(enemy: Fighter){
    return enemy.fighting.logistics.justDidAttack
  }

  hasAttackOpportunity(enemy: Fighter): boolean{
    const {proximity} = this.fighting
    const enemyAction = enemy.fighting.animation.inProgress
    if(this.fighting.proximity.getEnemyCombatCloseness(enemy) != Closeness['striking range']){
      console.error('should used if enemy not in striking range');
      debugger
      return 
    }
    return (
      this.justDodged || 
      this.justBlocked || 
      this.justTookHit ||
      enemyAction == 'recovering' || 
      enemyAction != 'defending'

    )
  
  }
    

};
