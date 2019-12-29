import Fighter from "../fighter";
import Direction360 from "../../../types/figher/direction-360";
import { random, timer } from "../../../helper-functions/helper-functions";
import FighterModelState from "../../../types/figher/fighter-model-states";
import Coords from '../../../interfaces/game/fighter/coords';
import FighterFightState from "../../../interfaces/game/fighter-fight-state-info";
import Movement from "./movement";
import Proximity from "./proximity";
import Combat from "./combat";
import { InteruptActions } from "../../../types/figher/interuptActions";
import SoundTime from "../../../interfaces/game/fighter/sound-time";
import { Actions } from "../../../types/figher/actions";

export default class FighterFighting {

  modelState: FighterModelState = 'Idle'
  stamina: number
  spirit: number
  knockedOut: boolean = false

  soundsMade: SoundTime[] = []

  stopFighting: boolean

  actionInProgress: Actions
  actionTimer
  cancelAction

  interuptActionInProgress: InteruptActions
  interuptActionTimer

  wanderAroundTimer
  wanderAroundDirection


  otherFightersInFight: Fighter[] = []

  speedBoost: boolean

  movement: Movement
  proximity: Proximity
  combat: Combat

  constructor(public fighter: Fighter) {
    this.movement = new Movement(this)
    this.proximity = new Proximity(this)
    this.combat = new Combat(this)
  }

  start() {
    this.otherFightersInFight = this.fighter.state.fight.fighters
      .filter(figher => figher.name != this.fighter.name)
    this.decideAction()
  }
  stop() {
    console.log(`${this.fighter.name} stopped fighting`);
    this.stopFighting = true
  }

  setStartPosition(coords: Coords) {
    this.movement.coords = coords
  }

  getState(): FighterFightState {
    return {
      name: this.fighter.name,
      coords: this.movement.coords,
      facingDirection: this.movement.facingDirection,
      modelState: this.modelState,
      soundsMade: this.soundsMade,
      onRampage: this.combat.onRampage,

    }
  }

  reset() {
    this.knockedOut = false
    this.stamina = this.fighter.state.maxStamina
    this.spirit = this.fighter.state.maxSpirit
    this.otherFightersInFight = []
    this.stopFighting = false
  }

  decideAction() {
    if(this.stopFighting)
      return
      
    if (this.proximity.fighterInfront('close')) {
      switch (this.combat.respondToFighter('close')) {
        case 'retreat':
          this.combat.retreatFromFighter(); break
        case 'defend':
          this.combat.startDefending(); break
        case 'attack':
          this.combat.tryToHitFighter(); break
      }
    }
    else if (this.proximity.fighterInfront('nearby')) {
      switch (this.combat.respondToFighter('nearby')) {
        case 'retreat':
          this.combat.retreatFromFighter(); break
        case 'attack':
          this.combat.moveToAttackFighter(); break
      }
    }
    else if (this.isStaminaLow()) {
      this.startToRecover()
    }
    else if (this.combat.noActionForAWhile && (this.combat.fighterTargetedForAttack = this.proximity.lookForClosestFighter())) {

      this.combat.moveToAttackFighter()
    }
    else {
      this.wanderAround()
    }

  }

  isStaminaLow() {
    return this.stamina < Math.round(this.fighter.state.maxStamina * .8)
  }

  private wanderAround() {
    //console.log(`${this.fighter.name} is wandering around`); 
    if (!this.wanderAroundDirection) {
      if (this.movement.nearEdge) {
        this.movement.movingDirection = this.movement.getDirectionAwayFromEdge()
      }
      else {
        this.movement.movingDirection = this.wanderAroundDirection = random(360) as Direction360
      }
      const duration = random(4, true) * 1000

      clearTimeout(this.wanderAroundTimer)
      this.wanderAroundTimer = setTimeout(() => {
        this.wanderAroundDirection = null
      }, duration)
    }
    const moveSpeed = this.movement.moveSpeed()
    this.startAction(moveSpeed, 'wandering around')
    this.movement.moveABit()
  }

  startToRecover() {
    this.modelState = 'Recovering'
    this.startAction(1000, 'recovering')
      .then(() => {
        console.log(`${this.fighter.name} just recovered 1 stamina`);
        this.stamina++
      })
  }

  startAction(duration: number, actionName: Actions): Promise<any> {

    if(this.interuptActionInProgress){
      return Promise.reject()
    }
    switch (actionName) {
      case 'wandering around':
      case 'moving to attack':
      case 'retreating':
      case 'cooldown': this.modelState = 'Walking'; break
      case 'blocking': this.modelState = 'Blocking'; break
      case 'critical striking': this.modelState = 'Kicking'; break
      case 'punching': this.modelState = 'Punching'; break
      case 'dodging': this.modelState = 'Dodging'; break
      case 'cooldown': this.modelState = 'Walking'; break
      case 'blocking': this.modelState = 'Blocking'; break
      case 'recovering': this.modelState = 'Recovering'; break
    }
    this.actionInProgress = actionName
    return new Promise((resolve, reject) => {
      this.cancelAction = reject
      this.actionTimer = setTimeout(() => {
        this.actionInProgress = null
        resolve()
      }, duration)
    })
      .catch(reason => {
        console.log(`${this.fighter.name}'s ${this.actionInProgress} has been canceled because ${reason}`)
        if (this.actionInProgress == 'wandering around') {
          this.wanderAroundDirection = null
          clearTimeout(this.wanderAroundTimer)
        }
        this.actionInProgress = null
        clearTimeout(this.actionTimer)
      })
      .finally(() => {
        setTimeout(() => {
          if (!this.actionInProgress && !this.interuptActionInProgress) {
            this.decideAction()
          } else {
            console.log(`${this.fighter.name} did not decide new action after ${actionName} because ${this.actionInProgress || this.interuptActionInProgress} in progress`);
          }
        }, 5)
      })
  }


  startInteruptAction(duration: number, actionName: InteruptActions): Promise<any> {
    switch (actionName) {
      case 'taking a hit':
        this.modelState = 'Taking Hit';
        break
    }
    if (this.actionInProgress) {
      this.cancelAction(actionName + ' started')
    }
    this.interuptActionInProgress = actionName
    return new Promise(resolve => {
      this.interuptActionTimer = setTimeout(() => {
        this.interuptActionInProgress = null
        resolve()
      }, duration)

    })
  }





};
