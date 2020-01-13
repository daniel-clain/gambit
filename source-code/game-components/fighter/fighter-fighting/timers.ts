import FighterFighting from "./fighter-fighting";
import { Timer } from "../../../interfaces/game/fighter/timer";
import { random } from "../../../helper-functions/helper-functions";

export default class Timers{

  constructor(private fighting: FighterFighting){}

  justTurnedAround: Timer = {
    name: 'just turned around',
    duration: 3000
  }
  doingRetreatFromFlanked: Timer ={
    name: 'retreating from flanked',
    duration: 3000
  }

  justBlocked: Timer = {
    name: 'just blocked',
    duration: 1500,
  }
  justDodged: Timer = {
    name: 'just dodged',
    duration: 1500,
  }
  justDidAttack: Timer = {
    name: 'just did attack',
    duration: 1500,
  }
  justTookHit: Timer = {
    name: 'just took a hit',
    duration: 1500,
  }
  onRampage: Timer = {
    name: 'on a rampage',
    duration: 5000,
  }
  noActionForAWhile: Timer = {
    name: 'no action for a while',
    duration: 7000,
    afterEffect: () => this.fighting.combat.noActionForAWhile = true
  }
  wanderingDirection: Timer = {
    name: 'wandering direction',
    duration: random(4, true) * 1000
  }
  
  doingFastRetreat: Timer = {
    name: 'doing fast retreat',
    duration: 3000,
  }
  doingCautiousRetreat: Timer = {
    name: 'doing cautious retreat',
    duration: 3000,
  }
  movingToAttack: Timer = {
    name: 'moving to attack',
    duration: 3000
  }
  
  retreating: Timer = {
    name: 'retreating',
    duration: 3000,
  }

  memoryOfEnemyBehind: Timer = {
    name: 'memory of enemy behind',
    duration: 3000,
    afterEffect: () => {
      delete this.fighting.proximity.rememberedEnemyBehind
    }
  }

}