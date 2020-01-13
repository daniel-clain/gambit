import FighterFighting from "../fighter-fighting";
import Action from "../../../../interfaces/game/fighter/action";
import { random } from "../../../../helper-functions/helper-functions";

export default class Actions {
  constructor(private fighting: FighterFighting){}
  
  turnAround: Action = {
    name: 'turning around',
    getDuration: () => 60,
    afterEffect: () => {
      this.fighting.facingDirection = this.fighting.facingDirection == 'left' ? 'right' : 'left'
      this.fighting.startTimer(this.fighting.timers.justTurnedAround)
    },
    cooldown: 60
  }
  moveABit: Action = {
    name: 'moving a bit',
    getDuration: () => this.fighting.movement.moveSpeed(),
    effect: () => this.fighting.movement.moveABit()
  }
  recover: Action = {
    name: 'recovering',
    getDuration: () => 2500,
    model: 'Recovering',
    afterEffect: () => {      
      console.log(`${this.fighting.fighter.name} just recovered 1 stamina`);
      this.fighting.stamina++
    }   
  }
  
  tryToCriticalStrike: Action = {
    name: 'trying to critical strike',
    model: 'Kicking',
    getDuration: () => 100,
    effect: () => {
      const {justDidAttack} = this.fighting.timers
      this.fighting.startTimer(justDidAttack)
    },
  }

  criticalStrike: Action = {
    name: 'critical striking',
    sound: 'Critical Strike',
    model: 'Kicking',
    getDuration: () => 600,
    effect: () => {
      const {spirit, fighter, timers, combat, stats} = this.fighting
      if(spirit < stats.maxSpirit)
        this.fighting.spirit ++  
      const chanceToGoOnARampage = random(3)
      if(chanceToGoOnARampage == 3)
        this.fighting.startTimer(timers.onRampage)
      
      combat.enemyTargetedForAttack.fighting.combat.takeAHit('critical strike', fighter)
    },
    cooldown: 900
  }

  
  missedCriticalStrike: Action = {
    name: 'missed critical strike',
    model: 'Kicking',
    getDuration: () => 600,
    effect: () => {
      if(this.fighting.spirit ! <= 0)
        this.fighting.spirit --
    },
    cooldown: 900
  }

  tryToPunch: Action = {
    name: 'trying to punch',
    model: 'Punching',
    effect: () => {
      const {justDidAttack} = this.fighting.timers
      this.fighting.startTimer(justDidAttack)
    },
    getDuration: () => 100
    
  }
  punch: Action = {
    name: 'punching',
    model: 'Punching',
    sound: 'Punch',
    effect: () => {
      const {spirit, fighter, combat, stats} = this.fighting
      if(spirit < stats.maxSpirit)
        this.fighting.spirit ++  
      combat.enemyTargetedForAttack.fighting.combat.takeAHit('punch', fighter)
    },
    getDuration: () => 500,
    cooldown: 700
  }
  
  missedPunch: Action = {
    name: 'missed punch',
    model: 'Punching',
    getDuration: () => 500,
    effect: () => {
      if(this.fighting.spirit ! <= 0)
        this.fighting.spirit --
    },
    cooldown: 600
  }

  defend: Action = {
    name: 'defending',
    model: 'Defending',
    getDuration: () => 1000  
  }
  
  block: Action = {
    name: 'blocking',
    sound: 'Block',
    getDuration: () => 600,
    model: 'Blocking',
    effect: () => {
      const {justBlocked} = this.fighting.timers
      this.fighting.startTimer(justBlocked)
    },
    cooldown: 200
  }
  
  dodge: Action = {
    name: 'dodging',
    getDuration: () => 600,
    model: 'Dodging',
    sound: 'Dodge',
    effect: () => {
      const {justDodged} = this.fighting.timers
      this.fighting.startTimer(justDodged)
    },
    cooldown: 200
  }

  takeAHit: Action = {
    name: 'taking a hit',
    getDuration: () => 600,
    model: 'Taking Hit',
    afterEffect: () => {
      if (this.fighting.stamina <= 0) 
        this.fighting.combat.getKnockedOut()
    },
    cooldown: 500
  }
};
