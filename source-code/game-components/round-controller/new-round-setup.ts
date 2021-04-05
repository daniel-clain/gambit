
import gameConfiguration from "../../game-settings/game-configuration";
import { shuffle, random } from "../../helper-functions/helper-functions";
import { GoalContract } from "../../interfaces/game/contract.interface";
import Fighter from "../fighter/fighter";
import Fight from "../fight/fight";
import { RoundController } from "./round-controller";
import { Manager } from "../manager";
import { Professional, JobSeeker } from "../../interfaces/front-end-state-interface";

export function setupNewRound(roundController: RoundController, professionals: Professional[], fighters: Fighter[], managers: Manager[]){

  setRoundJobSeekers()
  setupRoundFight()
  addNewRoundToManagerLog()
  clearOldNews()

  function clearOldNews(){
    roundController.preFightNewsStage.newsItems = []
  }

  function addNewRoundToManagerLog(){
    managers.forEach(manager => manager.functions.addToLog({type: 'new round', message: `Round ${roundController.roundNumber}`}));
  }

  function setRoundJobSeekers(){
    const { numberOfProfessionalJobSeekersPerRound, numberOfFighterJobSeekersPerRound } = gameConfiguration
    roundController.jobSeekers = 
    shuffle(professionals)
    .splice(0, numberOfProfessionalJobSeekersPerRound)
    .map((professional): JobSeeker => {
      let goalContract: GoalContract
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
      fighters.filter(fighter => 
        !fighter.state.dead &&
        !fighter.state.activeContract
      )
    )
    .slice(0, numberOfFighterJobSeekersPerRound)
    .map((fighter): JobSeeker => {
      fighter.determineGoalContract()
      return {
        type: 'Fighter',
        name: fighter.name,
        goalContract: fighter.state.goalContract
      }
    })

    roundController.jobSeekers.push(...fighterJobSeekers)


  }


  function setupRoundFight() {
    if (roundController.activeFight != null)
      roundController.activeFight.doTeardown()

    let numOfFighters

    if(roundController.roundNumber < 8)
      numOfFighters = 2
    else if(roundController.roundNumber < 16)
      numOfFighters = 3
    else
      numOfFighters = 4

      
    //numOfFighters = 8

    
    const randomFighters: Fighter[] = []

    for (; randomFighters.length < numOfFighters;) {
      const fightersRandomChance: {fighter: Fighter, chance: number}[] = fighters
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

    roundController.activeFight = new Fight(randomFighters, managers)

    roundController.lastFightFighters = randomFighters.map(fighter => fighter.name)


    roundController.activeFight.fightUiDataSubject.subscribe(() => {
      roundController.triggerUIUpdate()
    })
  }
  
}