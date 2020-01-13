import Fighter from "../fighter";
import { random, wait } from "../../../helper-functions/helper-functions";
import FighterModelState from "../../../types/figher/fighter-model-states";
import FighterFightState from "../../../interfaces/game/fighter-fight-state-info";
import Movement from "./movement";
import Proximity from "./proximity";
import Combat from "./combat";
import SoundTime from "../../../interfaces/game/fighter/sound-time";
import FacingDirection from "../../../types/figher/facing-direction";
import { ActiveTimer } from "../../../interfaces/game/fighter/active-timer";
import { Timer } from "../../../interfaces/game/fighter/timer";
import { TimerName } from "../../../types/figher/timer-name";
import Timers from './timers'
import Recovery from "./recovery";
import DecideActionProbability from "./fighter-actions/decide-action-probability";
import FighterStats from "./stats";
import Flanked from "../../../interfaces/game/fighter/flanked";
import FighterActions from "./fighter-actions/fighter-actions";
import Flanking from "./flanking";

export default class FighterFighting {

  modelState: FighterModelState = 'Idle'
  stamina: number
  spirit: number
  knockedOut: boolean = false
  _facingDirection: FacingDirection
  flanked: Flanked
  trapped: boolean

  soundsMade: SoundTime[] = []

  stopFighting: boolean

  otherFightersInFight: Fighter[] = []

  
  activeTimers: ActiveTimer[] = []

  stats: FighterStats
  movement: Movement
  proximity: Proximity
  combat: Combat
  timers: Timers
  actions: FighterActions
  recovery: Recovery
  flanking: Flanking
  decideActionProbability: DecideActionProbability

  constructor(public fighter: Fighter) {
    this.stats = new FighterStats(this)
    this.movement = new Movement(this)
    this.proximity = new Proximity(this)
    this.combat = new Combat(this)
    this.timers = new Timers(this)
    this.actions = new FighterActions(this)
    this.recovery = new Recovery(this)
    this.flanking = new Flanking(this)
    this.decideActionProbability = new DecideActionProbability(this)
  }

  start() {
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
      onRampage: this.activeTimers.some(timer => timer.name == 'on a rampage'),
      skin: this.fighter.skin,
      flanked: this.flanked
    }
  }

  reset() {
    this.knockedOut = false
    this.stamina = this.stats.maxStamina
    this.spirit = this.stats.maxSpirit
    this.otherFightersInFight = []
    this.stopFighting = false    
    this.facingDirection = !!random(2) ? 'left' : 'right'
    this.soundsMade = []
  }

  set facingDirection(direction: FacingDirection){    
    const enemy: Fighter = this.proximity.getClosestEnemyInfront()
    if(enemy)
      this.proximity.rememberEnemyBehind(enemy)    
    else
      this.proximity.rememberEnemyBehind(null)    

    this._facingDirection = direction
  }
  get facingDirection(): FacingDirection{
    return this._facingDirection
  }


  async startTimer(timer: Timer){
    const {name, duration} = timer
    let timeoutRef
    let countdownRef
    
    const randomNum = random(100)

    const logSupressedTimers: TimerName[] = [
      //'memory of enemy behind', 
      'just turned around'
    ]
    const timerAlreadyRunning = this.activeTimers.find(timer => timer.name == name)
    if(timerAlreadyRunning){
      timerAlreadyRunning.cancel(`it was reset with a new timer (${randomNum})`) 
      await wait(5)
    }

    return new Promise((resolve, reject) => {
      if(!logSupressedTimers.some(name => name == timer.name))
        console.log(`${this.fighter.name}'s ${name} timer (${randomNum}) started `);
      if(timeoutRef)
        debugger
      timeoutRef = setTimeout(() => resolve(randomNum), duration);
      this.activeTimers.push({
        name,
        cancel: reject,
        timeRemaining: duration
      })
      countdownRef = setInterval(() => this.activeTimers.find(timer => timer.name == name).timeRemaining -= 50, 50)
    })
    .then((passedRandomNumber) => {

      const timeRemaining = this.activeTimers.find(timer => timer.name == name).timeRemaining
      if (name == 'memory of enemy behind' && timeRemaining > 50)
        console.log(`${name}'s ${name} timedout has ${timeRemaining} time remaining localNum(${randomNum}) passedRandomNumber(${passedRandomNumber})`);
        
      console.log(`${this.fighter.name}'s ${name} timer (${randomNum}) has timed out`);
      timer.afterEffect && timer.afterEffect()
    })
    .catch(reason => {
      
      /* if(name == 'memory of enemy behind')
        console.log(`${this.fighter.name}'s ${name} canceled timer has ${this.activeTimers.find(timer => timer.name == name).timeRemaining} time remaining`); */
      if(!logSupressedTimers.some(name => name == timer.name))
        console.log(`${this.fighter.name}'s ${name} timer (${randomNum}) was cancled because ${reason}`);
      clearTimeout(timeoutRef)
    })
    .finally(() => {
      clearInterval(countdownRef)
      this.activeTimers.splice(this.activeTimers.findIndex(timer => timer.name === name), 1)
    })
  }

  cancelTimers(timerNames: TimerName[], reason){
    this.activeTimers.forEach(
      (timer: ActiveTimer) => 
        timerNames.some(timerName => timerName == timer.name) && 
        timer.cancel(reason)
    )
  }

  checkIfVictorious(){
    const otherFightersAreKnockedOut: boolean = this.otherFightersInFight.every((fighter: Fighter) => fighter.fighting.knockedOut)
    if(otherFightersAreKnockedOut)
      this.modelState = 'Victory'
  } 
  
  getOtherFightersStillFighting(){
    return this.otherFightersInFight.filter(fighter => !fighter.fighting.knockedOut)
  }

};
