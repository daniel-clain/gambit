import Fighter from "../fighter";
import { random } from "../../../helper-functions/helper-functions";
import FighterModelState from "../../../types/figher/fighter-model-states";
import FighterFightState from "../../../interfaces/game/fighter-fight-state-info";
import Movement from "./movement";
import Proximity from "./proximity";
import SoundTime from "../../../interfaces/game/fighter/sound-time";
import FacingDirection from "../../../types/figher/facing-direction";
import FighterStats from "./stats";
import Flanked from "../../../interfaces/game/fighter/flanked";
import Flanking from "./flanking";
import FighterTimers from "./fighter-timers";
import FighterAnimation from "./fighter-animation";
import FighterActions from "./fighter-actions";
import Logistics from "./logistics";
import FighterCombat from "./fighter-combat";

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
    this.stats = new FighterStats(this)
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
    this.spirit = this.stats.maxSpirit
    this.otherFightersInFight = this.fighter.state.fight.fighters
      .filter(figher => figher.name != this.fighter.name)
    this.actions.decideAction()
  }
  stop() {
    console.log(`${this.fighter.name} stopped fighting`);
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
      flanked: this.proximity.flanked,
      strikingCenters: {
        front: this.proximity.getFighterStrikingCenter(this.fighter),
        back: this.proximity.getFighterStrikingCenter(this.fighter, true)
      }
    }
  }

  reset() {
    this.proximity.flanked = undefined
    this.modelState = 'Idle'
    this.knockedOut = false
    this.spirit = this.stats.maxSpirit
    this.otherFightersInFight = []
    this.stopFighting = false    
    this.facingDirection = !!random(2) ? 'left' : 'right'
    this.soundsMade = []

    this.stats.strength = this.stats.baseStrength
    this.stats.speed = this.stats.baseSpeed
    this.stats.aggression = this.stats.baseAggression
    this.stats.intelligence = this.stats.baseIntelligence
    this.stats.maxSpirit = this.stats.baseSpirit
    this.stats.maxStamina = this.stats.baseStamina
    this.stamina = this.stats.maxStamina

  }

  set facingDirection(direction: FacingDirection){    
    if(this.fightStarted){
      const enemy: Fighter = this.proximity.getClosestEnemyInfront()
      if(enemy)
        this.proximity.rememberEnemyBehind(enemy)    
      else
        this.proximity.rememberEnemyBehind(null)   
    } 

    this._facingDirection = direction
  }
  get facingDirection(): FacingDirection{
    return this._facingDirection
  }


};
