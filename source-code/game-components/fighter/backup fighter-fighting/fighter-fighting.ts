import Fighter from "../fighter";
import { randomNumber } from "../../../helper-functions/helper-functions";
import FighterModelState from "../../../types/fighter/fighter-model-states";
import Movement from "./movement";
import Proximity, { getFighterStrikingCenter } from "./proximity";
import SoundTime from "../../../interfaces/game/fighter/sound-time";
import FacingDirection from "../../../types/fighter/facing-direction";
import FighterStats from "./stats";
import FighterTimers from "./fighter-timers";
import FighterActions from "./fighter-actions";
import Logistics from "./logistics";
import FighterCombat from "./fighter-combat";
import FighterFightState from "../../../interfaces/front-end-state-interface";
import gameConfiguration from "../../../game-settings/game-configuration";


export default class FighterFighting {

  modelState: FighterModelState = 'Idle'
  private _stamina: number
  private _spirit: number
  private _energy: number
  private _facingDirection: FacingDirection
  
  knockedOut: boolean = false
  enemyTargetedForAttack: Fighter  

  soundsMade: SoundTime[] = []

  fightStarted: boolean
  stopFighting: boolean

  otherFightersInFight: Fighter[] = []

  energyRegenInterval = 1000
  energyRegenTimeout
  passiveRecoverInterval = 1000
  passiveRecoverTimeout

  stats: FighterStats
  movement: Movement
  proximity: Proximity
  actions: FighterActions
  timers: FighterTimers
  logistics: Logistics
  combat: FighterCombat
  

  constructor(public fighter: Fighter) {
    this.stats = new FighterStats(this.fighter)
    this.movement = new Movement(this)
    this.proximity = new Proximity(this)
    this.actions = new FighterActions(this)
    this.timers = new FighterTimers(this)
    this.logistics = new Logistics(this)
    this.combat = new FighterCombat(this)
  }

  setup(){
    this.fightStarted = false
    this.modelState = 'Idle'
    this.facingDirection = !!randomNumber({to: 1}) ? 'left' : 'right'
    const {fight, injured, sick} = this.fighter.state

    this.stamina = (injured || sick) ? this.stats.maxStamina * 0.8 : this.stats.maxStamina
    
    this.spirit = (injured || sick) ? 2 : 3
    this.energy = (injured || sick) ? this.stats.maxEnergy * 0.8 : this.stats.maxEnergy
    this.otherFightersInFight = fight.fighters
      .filter(fighter => fighter.name != this.fighter.name)
  }

  start() {
    this.fightStarted = true
    this.energyRegenTimeout = setInterval(() => this.regenEnergy(), this.energyRegenInterval);
    this.passiveRecoverTimeout = setInterval(() => this.passiveRecover(), this.passiveRecoverInterval);

    if(gameConfiguration.freezeFight) return
    this.actions.decideAction()
  }
  stop() {
    console.log(`${this.fighter.name} stopped fighting`);
    this.stopFighting = true
    clearTimeout(this.energyRegenTimeout)
    clearTimeout(this.passiveRecoverTimeout)
  }
  reset() {
    this.knockedOut = false
    this.otherFightersInFight = []
    this.stopFighting = false    
    this.soundsMade = []
    this.timers.activeTimers.forEach(t => t.cancel())
    this.logistics.rememberedEnemyBehind = undefined
    this.actions.decidedActionLog = []

  }

  getState(): FighterFightState {
    return {
      name: this.fighter.name,
      coords: this.movement.coords,
      facingDirection: this.facingDirection,
      modelState: this.modelState,
      soundsMade: this.soundsMade,
      onRampage: this.logistics.onARampage,
      skin: this.fighter.skin,
      strikingCenters: {
        front: getFighterStrikingCenter(this.fighter),
        back: getFighterStrikingCenter(this.fighter, true)
      },
      spirit: this.spirit,
      energy: this.energy,
      currentMainAction: this.actions.currentMainAction,
      currentInterruptibleAction: this.actions.currentInterruptibleAction,
      direction: this.movement.movingDirection,
      directionBasedOn: this.movement.directionBasedOn
    }
  }


  set facingDirection(direction: FacingDirection){   
    const {closestEnemyInFront} = this.logistics
    console.log(`set facing direction from ${this._facingDirection} to ${direction} (${this.fighter.name})`);
    if(this.fightStarted){
      if(direction == this.facingDirection){
        debugger
      }
      if(direction != this.facingDirection){
        const enemy: Fighter = closestEnemyInFront
        this.rememberEnemyBehind(enemy || null)   
      }
    }

    this._facingDirection = direction 

  }

  rememberEnemyBehind(enemy: Fighter | null | undefined){

      
    const newVal = enemy ? {...enemy} as Fighter : enemy

    this.logistics.rememberedEnemyBehind = newVal

    this.timers.start('memory of enemy behind')
  }

  get facingDirection(): FacingDirection{
    return this._facingDirection
  }
  

  passiveRecover(){
    if(!this.timers.get('last combat action')){
      
      this.stamina += .25
      if(this.spirit < 3){
        this.spirit += .25
      }
      if(this.spirit > 3){
        this.spirit -= .25
      }
    }
  }

  regenEnergy(){
    this.energy += .1 + this.stats.fitness * .025 + (this.logistics.onARampage ? .5 : 0)
  }
  set energy(val: number){
    
    if(val < 0)
      this._energy = 0
    else if(val > this.stats.maxEnergy)
      this._energy = this.stats.maxEnergy
    else
      this._energy = val
  }

  get energy(){return this._energy}

  
  set spirit(val: number){
    
    if(val < 0)
      this._spirit = 0
    else if(val > this.stats.maxSpirit)
      this._spirit = this.stats.maxSpirit
    else
      this._spirit = val
  }

  get spirit(){return this._spirit}

  set stamina(val: number){
    
    if(val < 0)
      this._stamina = 0
    else if(val > this.stats.maxStamina)
      this._stamina = this.stats.maxStamina
    else
      this._stamina = val
  }

  get stamina(){return this._stamina}


};
