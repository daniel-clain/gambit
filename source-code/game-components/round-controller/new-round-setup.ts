import Game from "../game";
import gameConfiguration from "../game-configuration";
import { shuffle, random } from "../../helper-functions/helper-functions";
import { JobSeeker } from "../../interfaces/game-ui-state.interface";
import { Contract } from "../../interfaces/game/contract.interface";
import Fighter from "../fighter/fighter";
import Fight, { FightState } from "../fight/fight";

export function setupNewRound(game: Game){
  setRoundJobSeekers(game)
  setupRoundFight(game)
}


function setRoundJobSeekers(game: Game){
  const { numberOfProfessionalJobSeekersPerRound, numberOfFighterJobSeekersPerRound } = gameConfiguration
  game.roundController.jobSeekers = 
  shuffle(game.professionals)
  .splice(0, numberOfProfessionalJobSeekersPerRound)
  .map((professional): JobSeeker => {
    let goalContract: Contract
    switch(professional.profession){
      case 'Drug Dealer':
        goalContract = {
          numberOfWeeks: 2 + random(4, true),
          weeklyCost: 20 * professional.skillLevel
        }; break
      case 'Hitman':
        goalContract = {
          numberOfWeeks: 1 + random(1, true),
          weeklyCost: 30 * professional.skillLevel
        }; break      
      case 'Private Agent':
        goalContract = {
          numberOfWeeks: 2 + random(2, true),
          weeklyCost: 20 * professional.skillLevel
        }; break
      case 'Lawyer':
        goalContract = {
          numberOfWeeks: 1 + random(1, true),
          weeklyCost: 20 * professional.skillLevel
        }; break      
      case 'Promoter':
        goalContract = {
          numberOfWeeks: 2 + random(3, true),
          weeklyCost: 10 * professional.skillLevel
      }; break      
      case 'Talent Scout':
        goalContract = {
          numberOfWeeks: 1 + random(5, true),
          weeklyCost: 5 * professional.skillLevel
      }; break
      case 'Thug':
        goalContract = {
          numberOfWeeks: 5 + random(3, true),
          weeklyCost: 10 
      }; break
      case 'Trainer':
        goalContract = {
          numberOfWeeks: 6 + random(4, true),
          weeklyCost: 5 * professional.skillLevel
      }; break
    }
    const {name, profession, skillLevel, abilities} = professional
    return {type: 'Professional', name, profession, goalContract, skillLevel, abilities}
  })

  const fighterJobSeekers: JobSeeker[] = 
  shuffle(
    game.fighters.filter(fighter => 
      !fighter.state.dead &&
      !fighter.state.activeContract
    )
  )
  .slice(0, numberOfFighterJobSeekersPerRound)
  .map((fighter): JobSeeker => ({
    type: 'Fighter',
    name: fighter.name,
    goalContract: {
      numberOfWeeks: 6,
      weeklyCost: 5
    }
  }))

  game.roundController.jobSeekers.push(...fighterJobSeekers)

}


function setupRoundFight(game: Game) {
  const {roundController} = game
  if (roundController.activeFight != null)
    roundController.activeFight.doTeardown()

  let numOfFighters = gameConfiguration.numberOfFightersPerFight

  if(game.roundController.roundNumber < 8)
    numOfFighters -= 1
  if(game.roundController.roundNumber > 16)
    numOfFighters += 1
  
  const randomFighters: Fighter[] = []

  for (; randomFighters.length < numOfFighters;) {
    const fightersRandomChance: {fighter: Fighter, chance: number}[] = game.fighters
    .filter(fighter => 
      !fighter.state.dead &&
      !roundController.lastFightFighters.includes(fighter.name) &&
      !randomFighters.some(randomFighter => randomFighter.name == fighter.name)
    )
    .map(fighter => (
      {
        fighter,
        chance: 1 + fighter.state.publicityRating
      }
    ))

    const totalProbability: number = fightersRandomChance.reduce((total, fighter) => total + fighter.chance, 0)  

    const randomNum = random(totalProbability, true)

    let probabilityRange: number = 0;

    for (let fighterChance of fightersRandomChance) {
      if (
        randomNum > probabilityRange &&
        randomNum <= probabilityRange + fighterChance.chance
      ){
        randomFighters.push(fighterChance.fighter)
        break
      }
      else
        probabilityRange += fighterChance.chance
    }
  }

  game.roundController.activeFight = new Fight(randomFighters)

  game.roundController.lastFightFighters = randomFighters.map(fighter => fighter.name)


  game.roundController.activeFight.fightStateUpdatedSubject.subscribe((fightState: FightState) => {
    game.roundController.fightStateUpdatedSubject.next(fightState)
  })
}