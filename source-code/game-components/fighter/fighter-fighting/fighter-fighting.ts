import Fighter from "../fighter";
import { random } from "../../../helper-functions/helper-functions";
import FighterModelState from "../../../types/fighter/fighter-model-states";
import Movement from "./movement";
import Proximity, { getFighterStrikingCenter } from "./proximity";
import SoundTime from "../../../interfaces/game/fighter/sound-time";
import FacingDirection from "../../../types/fighter/facing-direction";
import FighterStats from "./stats";
import Flanking from "./flanking";
import FighterTimers from "./fighter-timers";
import FighterAnimation from "./fighter-animation";
import FighterActions from "./fighter-actions";
import Logistics from "./logistics";
import FighterCombat from "./fighter-combat";
import FighterFightState from "../../../interfaces/front-end-state-interface";
import gameConfiguration from "../../../game-settings/game-configuration";

export default class FighterFighting {

  modelState: FighterModelState = 'Idle'
  stamina: number
  spirit: number
  knockedOut: boolean = false
  _facingDirection: FacingDirection
  enemyTargetedForAttack: Fighter  
  rememberedEnemyBehind: Fighter

  soundsMade: SoundTime[] = []

  fightStarted: boolean
  stopFighting: boolean

  otherFightersInFight: Fighter[] = []


  stats: FighterStats
  movement: Movement
  proximity: Proximity
  actions: FighterActions
  flanking: Flanking
  animation: FighterAnimation
  timers: FighterTimers
  logistics: Logistics
  combat: FighterCombat

  constructor(public fighter: Fighter) {
    this.stats = new FighterStats(this.fighter)
    this.movement = new Movement(this)
    this.proximity = new Proximity(this)
    this.actions = new FighterActions(this)
    this.flanking = new Flanking(this)
    this.animation = new FighterAnimation(this)
    this.timers = new FighterTimers(this)
    this.logistics = new Logistics(this)
    this.combat = new FighterCombat(this)
  }

  start() {
    this.fightStarted = true
    this.stamina = this.stats.maxStamina
    this.otherFightersInFight = this.fighter.state.fight.fighters
      .filter(fighter => fighter.name != this.fighter.name)
    if(gameConfiguration.freezeFight) return
    this.actions.decideAction()
  }
  stop() {
    //console.log(`${this.fighter.name} stopped fighting`);
    this.stopFighting = true
  }

  getState(): FighterFightState {
    return {
      name: this.fighter.name,
      coords: this.movement.coords,
      facingDirection: this.facingDirection,
      modelState: this.modelState,
      soundsMade: this.soundsMade,
      onRampage: this.timers.activeTimers.some(timer => timer.name == 'on a rampage'),
      skin: this.fighter.skin,
      retreatingFromFlanked: this.movement.moveActionInProgress == 'retreat from flanked',
      trapped: this.proximity.trapped,
      strikingCenters: {
        front: getFighterStrikingCenter(this.fighter),
        back: getFighterStrikingCenter(this.fighter, true)
      },
      spirit: this.spirit,
      repositioning: this.movement.moveActionInProgress == 'reposition',
      direction: this.movement.movingDirection
    }
  }

  reset() {
    this.proximity.flanked = undefined
    this.modelState = 'Idle'
    this.knockedOut = false
    this.spirit = 3
    this.otherFightersInFight = []
    this.stopFighting = false    
    this.facingDirection = !!random(2) ? 'left' : 'right'
    this.soundsMade = []
    this.stamina = this.stats.maxStamina

  }

  set facingDirection(direction: FacingDirection){  

    if(this.fightStarted){
      const enemy: Fighter = this.proximity.getClosestEnemyInfront()
      this._facingDirection = direction  
      if(enemy)
        this.proximity.rememberEnemyBehind(enemy)    
      else
        this.proximity.rememberEnemyBehind(null)   
    }
    else
      this._facingDirection = direction  

  }
  get facingDirection(): FacingDirection{
    return this._facingDirection
  }


};
