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
import {
  ClientAbility,
  TargetTypes,
} from "../../game-components/abilities-general/ability"
import gameConfiguration from "../../game-settings/game-configuration"
import {
  fighterInNextFight,
  fighterOwnedByManager,
  ifTargetIsFighter,
  isThisManager,
} from "../front-end-service/ability-service-client"

const {
  afflictions: { injured },
} = gameConfiguration

export const researchFighterClient: ClientAbility = {
  ...researchFighter,
  longDescription:
    "find out more stats about fighter, amount of stats is relative to skill level and profession",
  isValidTarget(target: TargetTypes) {
    return target.characterType == "Fighter"
  },
}

export const assaultFighterClient: ClientAbility = {
  ...assaultFighter,
  longDescription: `When a fighter is assaulted they become injured which means:
      - start on ${injured.startStaminaPercentReduction}% reduced stamina
      - strength and fitness reduced by ${injured.strengthAndFitnessPercentReduction}%
      - take ${injured.extraDamagePercentTaken}% more damage
      - ${injured.chanceToFlinchAfterAttackingOrBeingAttacked}% chance to flinch after attacking or being attacked, unless on a rampage
      - increase chance to rampage by ${injured.increasedChanceToRampageAfterAttack}% after attacking

    `,
  isValidTarget(target: TargetTypes) {
    return (
      target.characterType == "Fighter" &&
      !fighterOwnedByManager(target) &&
      fighterInNextFight(target)
    )
  },
}

export const doSurveillanceClient: ClientAbility = {
  ...doSurveillance,
  longDescription:
    "Find out what is happening with target manager or fighter. If the manager does anything or if anything happens to the fighter while they are being watched, the private agent will collect evidence.",
  isValidTarget(target: TargetTypes) {
    return (
      (target.characterType == "Fighter" &&
        fighterInNextFight(target) &&
        !fighterOwnedByManager(target)) ||
      (target.characterType == "Known Manager" && !isThisManager(target))
    )
  },
}

export const dominationVictoryClient: ClientAbility = {
  ...dominationVictory,
  longDescription:
    "Win the game by having the most dominant fighters. Force a tournament between the best fighters in the game. Whichever fighter wins the tournament, that fighters manager wins the game",
}

export const dopeFighterClient: ClientAbility = {
  ...dopeFighter,
  longDescription:
    "Gives the fighter more strength, speed and recovery and less intelligence for 1 week only. Also increases aggression permanently.",
  isValidTarget(target: TargetTypes) {
    let isValid = false
    ifTargetIsFighter(
      target,
      (fighter) => (isValid = fighterInNextFight(fighter))
    )
    return isValid
  },
}

export const guardFighterClient: ClientAbility = {
  ...guardFighter,
  longDescription:
    "The more skilled the guard is the higher the chance to block an attempt. Can block attempts to assault, poison or murder a fighter",
  isValidTarget(target: TargetTypes) {
    let isValid = false
    ifTargetIsFighter(
      target,
      (fighter) => (isValid = fighterOwnedByManager(fighter))
    )
    return isValid
  },
}

export const investigateManagerClient: ClientAbility = {
  ...investigateManager,
  longDescription: `Find out stats about opponent manager, including: money, loan debt, employees, fighters, evidence on other managers. This ability resolves ${investigateManager.executes}`,
  isValidTarget(target: TargetTypes) {
    return target.characterType == "Known Manager" && !isThisManager(target)
  },
}

export const murderFighterClient: ClientAbility = {
  ...murderFighter,
  longDescription:
    "Chance to kill target fighter. If no guard, 65 + skill level * 5. If guard, 15 - guard level * 5 + skill level * 5",
  isValidTarget(target: TargetTypes) {
    let isValid = false
    ifTargetIsFighter(
      target,
      (fighter) =>
        (isValid =
          fighterInNextFight(fighter) && !fighterOwnedByManager(fighter))
    )
    return isValid
  },
}

export const offerContractClient: ClientAbility = {
  ...offerContract,
  longDescription: `Offer a fighter or professional a contract to work for you, you earn more money when your fighter wins, and your employees can perform actions on your behalf. If you offer less than what they're asking for, theres a chance they will refuse. If another manager makes a better offer, they will take that offer instead`,
  isValidTarget(target: TargetTypes) {
    if (target.characterType == "Fighter") {
      if (target.goalContract) {
        return true
      }
    }
    return target.characterType == "Job Seeker"
  },
}
const { hallucinating, sick } = gameConfiguration.afflictions
export const poisonFighterClient: ClientAbility = {
  ...poisonFighter,
  longDescription: `Put harmful drugs in victims food, may cause sickness, hallucinations, or even death. Requires a Drug Dealer employee. 

    Hallucinating
      - ${hallucinating.chanceToHaveHallucinations}% chance to have hallucinations
      - when having hallucinations:
        ~ chance to rampage increased by ${hallucinating.extraChanceToRampage}%
        ~ speed on rampage increased by ${hallucinating.fasterSpeedPercentOnRampage}%
        ~ increased chance to run away ${hallucinating.increasedProbabilityToDesperateRetreat}%
        ~ attack targets that arent there
        ~ intelligence reduced by ${hallucinating.intelligencePercentReduction}%

    Sickness
      - ${sick.chanceToBeSick}% chance to be sick
      - agression reduced by ${sick.agressionPercentageReduced}%
      - starting and max spirit reduced by ${sick.startAndMaxSpiritReduced}%
      - strength and fitness recution ${sick.strengthAndFitnessPercentReduction}%
      - damage dealt reduced by ${sick.damageDealtReduction}%
      - energy regen reduced by ${sick.energyRegenReductionPercentage}%
      
`,
  isValidTarget(target: TargetTypes): boolean {
    let isValid = false
    ifTargetIsFighter(
      target,
      (fighter) =>
        (isValid =
          fighterInNextFight(fighter) && !fighterOwnedByManager(fighter))
    )
    return isValid
  },
}

export const prosecuteManagerClient: ClientAbility = {
  longDescription:
    "Prosecute an opponent manager for illegal activity, amount sued for is relative to the severity of each account manager is found guilty of. +100 cost for each accusation, 20% chance of success without evidence",
  ...prosecuteManager,
  isValidTarget(target: TargetTypes) {
    return target.characterType == "Known Manager" && !isThisManager(target)
  },
}

export const promoteFighterClient: ClientAbility = {
  ...promoteFighter,
  longDescription:
    "Increases the chance your fighter will be put into fights, and increases the amount of prize money for the fight",
  isValidTarget(target: TargetTypes) {
    let isValid = false
    ifTargetIsFighter(
      target,
      (fighter) => (isValid = fighterOwnedByManager(fighter))
    )
    return isValid
  },
}

export const sellDrugsClient: ClientAbility = {
  ...sellDrugs,
  longDescription:
    "Make money relative to skill level. Make less money if other drug dealers are selling",
}

export const takeADiveClient: ClientAbility = {
  ...takeADive,
  longDescription: `This fighter will try to not win, he will move slower and be unaggressive. However, if a rampage is triggered, he will forget he is taking a dive`,
  isValidTarget(target: TargetTypes) {
    let isValid = false
    ifTargetIsFighter(
      target,
      (fighter) =>
        (isValid =
          fighterOwnedByManager(fighter) && fighterInNextFight(fighter))
    )
    return isValid
  },
}

export const trainFighterClient: ClientAbility = {
  ...trainFighter,
  longDescription:
    "Increase target fighters fitness and strength, with affect the fighters hit damage, stamina, speed and recovery rate",
  isValidTarget(target: TargetTypes) {
    let isValid = false
    ifTargetIsFighter(target, (fighter) => (isValid = !!fighter))
    return isValid
  },
}
export const sinisterVictoryClient: ClientAbility = {
  ...sinisterVictory,
  longDescription:
    `Win the game by killing your opponent managers. Your opponents can counter your attempt to win if:` +
    `\n\t the average of (other hitmen skill times (*) 2 plus (+) other thugs skill) is more than your hitmen skill times (*) 2 plus (+) thugs skill.If you fail you will lose the game`,
}

export const wealthVictoryClient: ClientAbility = {
  ...wealthVictory,
  longDescription:
    "Win the game by financially crushing your opponents. Your opponents can counter your attempt to win by matching you in lawyers and having more money than you",
}

export const giveUpClient: ClientAbility = {
  ...giveUp,
  longDescription:
    "When you have no money left, and theres nothing else you can do",
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
  giveUpClient,
]
