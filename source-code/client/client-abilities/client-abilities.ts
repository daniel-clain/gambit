import { assaultFighter } from "../../game-components/abilities-general/abilities/assault-fighter"
import { doSurveillance } from "../../game-components/abilities-general/abilities/do-surveillance"
import { dominationVictory } from "../../game-components/abilities-general/abilities/domination-victory"
import { dopeFighter } from "../../game-components/abilities-general/abilities/dope-fighter"
import { giveUp } from "../../game-components/abilities-general/abilities/give-up"
import { guardFighter } from "../../game-components/abilities-general/abilities/guard-fighter"
import { investigateManager } from "../../game-components/abilities-general/abilities/investigate-manager"
import { murderFighter } from "../../game-components/abilities-general/abilities/murder-fighter"
import { offerContract } from "../../game-components/abilities-general/abilities/offer-contract"
import { poisonFighter } from "../../game-components/abilities-general/abilities/poison-fighter"
import { promoteFighter } from "../../game-components/abilities-general/abilities/promote-fighter"
import { prosecuteManager } from "../../game-components/abilities-general/abilities/prosecute-manager"
import { researchFighter } from "../../game-components/abilities-general/abilities/research-fighter"
import { sellDrugs } from "../../game-components/abilities-general/abilities/sell-drugs"
import { sinisterVictory } from "../../game-components/abilities-general/abilities/sinister-victory"
import { takeADive } from "../../game-components/abilities-general/abilities/take-a-dive"
import { trainFighter } from "../../game-components/abilities-general/abilities/train-fighter"
import { wealthVictory } from "../../game-components/abilities-general/abilities/wealth-victory"
import { ClientAbility, TargetTypes } from "../../game-components/abilities-general/ability"
import { fighterOwnedByManager, fighterInNextFight, ifTargetIsFighter, isThisManager } from "../front-end-service/ability-service-client"




export const researchFighterClient: ClientAbility = {
  ...researchFighter,
  longDescription: 'find out more stats about fighter, amount of stats is relative to skill level and profession',
  isValidTarget(target: TargetTypes){
    return target.characterType == 'Fighter'
  }
}


export const assaultFighterClient: ClientAbility = {
  ...assaultFighter,
  longDescription: 'An injured fighter will be slower in a fight and have less stamina and recovery',
  isValidTarget(target: TargetTypes){
    return (
      target.characterType == 'Fighter' && 
      !fighterOwnedByManager(target) && 
      fighterInNextFight(target)
    )
  }
}


export const doSurveillanceClient: ClientAbility = {
  ...doSurveillance,
  longDescription: 'Find out what is happening with target manager or fighter. If the manager does anything or if anything happens to the fighter while they are being watched, the private agent will collect evidence.',
  isValidTarget(target: TargetTypes){
    return (
      (
        target.characterType == 'Fighter' && 
        fighterInNextFight(target) && 
        !fighterOwnedByManager(target)
      ) || (
        target.characterType == 'Known Manager' && 
        !isThisManager(target)
      )
    )
  }
}


export const dominationVictoryClient: ClientAbility = {
  ...dominationVictory,
  longDescription: 'Win the game by having the most dominant fighters. Force a tournament between the best fighters in the game. Whichever fighter wins the tournament, that fighters manager wins the game',
  
}


export const dopeFighterClient: ClientAbility = {
  ...dopeFighter,
  longDescription: 'Gives the fighter more strength, speed and recovery for 1 week only. Also increases aggression permanently.',
  isValidTarget(target: TargetTypes){
    let isValid
    ifTargetIsFighter(target, fighter =>
      isValid = 
        fighterInNextFight(fighter)
    )
    return isValid
  }
}


export const guardFighterClient: ClientAbility = {
  ...guardFighter,
  longDescription: 'The more skilled the guard is the higher the chance to block an attempt. Can block attempts to assault, poison or murder a fighter',
  isValidTarget(target: TargetTypes){
    let isValid
    ifTargetIsFighter(target, fighter =>
      isValid = fighterOwnedByManager(fighter)
    )
    return isValid
  }
}

export const investigateManagerClient: ClientAbility = {
  ...investigateManager,
  longDescription: `Find out stats about opponent manager, including: money, loan debt, employees, fighters, evidence on other managers. This ability resolves at the end of the week`,
  isValidTarget(target: TargetTypes){
    return (
      target.characterType == 'Known Manager' && 
      !isThisManager(target)
    )
  }
}


export const murderFighterClient: ClientAbility = {
  ...murderFighter,
  longDescription: 'Chance to kill target fighter',
  isValidTarget(target: TargetTypes){
    let isValid
    ifTargetIsFighter(target, fighter =>
      isValid = fighterInNextFight(fighter) && !fighterOwnedByManager(fighter)
    )
    return isValid
  }
}

export const offerContractClient: ClientAbility = {
  ...offerContract,
  longDescription: `Offer a fighter or professional a contract to work for you, you earn more money when your fighter wins, and your employees can perform actions on your behalf. If you offer less than what they're asking for, theres a chance they will refuse. If another manager makes a better offer, they will take that offer instead`,
  isValidTarget(target: TargetTypes) {
    return target.characterType == 'Job Seeker'
  }
}

export const poisonFighterClient: ClientAbility = {
  ...poisonFighter,
  longDescription: 'Has a varying chance to inflict a range of affect on a fighter, from lowering hit chance, reduction in speed and strength, or even death. Requires a Drug Dealer employee',
  isValidTarget(target: TargetTypes){
    let isValid
    ifTargetIsFighter(target, fighter =>
      isValid = fighterInNextFight(fighter) && !fighterOwnedByManager(fighter)
    )
    return isValid
  }
}

export const prosecuteManagerClient: ClientAbility = {
  longDescription: 'Prosecute an opponent manager for illegal activity, amount sued for is relative to the severity of each account manager is found guilty of. +100 cost for each accusation, 20% chance of success without evidence',
  ...prosecuteManager,
  isValidTarget(target: TargetTypes){
    return (
      target.characterType == 'Known Manager' && 
      !isThisManager(target)
    )
  }
}

export const promoteFighterClient: ClientAbility = {
  ...promoteFighter,
  longDescription: 'Increases the chance your fighter will be put into fights, and increases the amount of prize money for the fight',
  isValidTarget(target: TargetTypes){
    let isValid
    ifTargetIsFighter(target, fighter =>
      isValid = fighterOwnedByManager(fighter)
    )
    return isValid
  }
}



export const sellDrugsClient: ClientAbility = {
  ...sellDrugs,
  longDescription: 'Make money relative to skill level. Make less money if other drug dealers are selling'
}

export const sinisterVictoryClient: ClientAbility = {
  ...sinisterVictory,
  longDescription: 'Win the game by killing your opponent managers. Your opponents can counter your attempt to win if the average of their combined thugs and hitmen are more than half of yours. If you fail you will lose the game'
}



export const takeADiveClient: ClientAbility = {
  ...takeADive,
  longDescription: `This fighter will try to not win, he will move slower and be unaggressive. However, if a rampage is triggered, he will forget he is taking a dive`,
  isValidTarget(target: TargetTypes){
    let isValid
    ifTargetIsFighter(target, fighter =>
      isValid = fighterOwnedByManager(fighter) && fighterInNextFight(fighter)
    )
    return isValid
  }
}

export const trainFighterClient: ClientAbility = {
  ...trainFighter,
  longDescription: 'Increase target fighters fitness and strength, with affect the fighters hit damage, stamina, speed and recovery rate',
  isValidTarget(target: TargetTypes){
    let isValid
    ifTargetIsFighter(target, fighter =>
      isValid = !!fighter
    )
    return isValid
  }
}



export const wealthVictoryClient: ClientAbility = {
  ...wealthVictory,
  longDescription: 'Win the game by financially crushing your opponents. Your opponents can counter your attempt to win if the average of their combined wealth or lawyers is more than half of yours. If you fail you will lose money equal to the average of their combined wealth'
}

export const giveUpClient: ClientAbility = {
  ...giveUp,
  longDescription: 'When you have no money left, and theres nothing else you can do'
}




export const abilities = [
  researchFighterClient,
  assaultFighterClient,
  doSurveillanceClient,
  dominationVictoryClient,
  dopeFighterClient,
  guardFighterClient,
  investigateManagerClient,
  murderFighterClient,
  offerContractClient,
  poisonFighterClient,
  prosecuteManagerClient,
  promoteFighterClient,
  sellDrugsClient,
  sinisterVictoryClient,
  takeADiveClient,
  trainFighterClient,
  wealthVictoryClient,
  giveUpClient
]





















