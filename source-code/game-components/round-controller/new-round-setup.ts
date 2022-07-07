
import gameConfiguration from "../../game-settings/game-configuration";
import { shuffle, random, percentageChance } from "../../helper-functions/helper-functions";
import { GoalContract } from "../../interfaces/game/contract.interface";
import Fighter from "../fighter/fighter";
import Fight from "../abilities-general/fight/fight";
import { Manager } from "../manager";
import { JobSeeker, FighterInfo } from "../../interfaces/front-end-state-interface";
import { Game } from "../game";

export function setupNewRound(game: Game){
  const {managers, professionals, fighters, roundController} = game.has

  const {roundNumber} = roundController

  chanceNextFightEvent()
  setRoundJobSeekers()
  setupRoundFight()


  managers.forEach(manager => {
    addNewRoundToManagerLog(manager)
    addFightersToManagersKnownFightersList(manager)
    if(manager.state.inJail){
      manager.functions.addToLog({
        roundNumber,
        type: 'critical', 
        message: `You are in jail! (${manager.state.inJail.weeksRemaining} weeks remaining)`});
    }
  })

  function chanceNextFightEvent(){
    const {nextWeekIsEvent, thisWeekIsEvent, roundNumber} = roundController
    if(!nextWeekIsEvent && !thisWeekIsEvent && roundNumber > 15 && percentageChance({percentage: 20})){
      roundController
      roundController.nextWeekIsEvent = true
      roundController.preFightNewsStage.newsItems.push({
        newsType: 'fight event next week',
        message: 'The top 10 fighters will compete in a battle royal, all winnings are tripled',
        headline: 'Main Event!',
        duration: 5
      })

    }
  }

  function addFightersToManagersKnownFightersList(manager: Manager){
    const roundFightersAndJobSeekerFighters: FighterInfo[] = []
    const roundFightersInfo: FighterInfo[] = 
    roundController.activeFight.fighters.map(fighter => fighter.getInfo())

    const jobSeekerFighterInfo: FighterInfo[] = roundController.jobSeekers
    .filter(jobSeeker => jobSeeker.type == 'Fighter')
    .map(jobSeekerFighter => fighters.find(fighter => fighter.name == jobSeekerFighter.name).getInfo())

    roundFightersAndJobSeekerFighters.push(...roundFightersInfo, ...jobSeekerFighterInfo)


    roundFightersAndJobSeekerFighters.forEach(roundFighter => {
      if(
        managerDoesNotOwnRoundFighter() &&
        managerDoesNotKnowRoundFighter()
      )
        manager.has.knownFighters.push({
          name: roundFighter.name,
          goalContract: roundFighter.goalContract,
          strength: undefined,
          fitness: undefined,
          intelligence: undefined,
          aggression: undefined,
          manager: undefined,
          numberOfFights: undefined,
          numberOfWins: undefined,
          activeContract: undefined
        })
      else{
        manager.has.knownFighters = manager.has.knownFighters.map(knownFighter => {
          const fighterJobSeeker =  roundController.jobSeekers.find(fighterJobSeeker => fighterJobSeeker.name == knownFighter.name)
          return {...knownFighter, goalContract: fighterJobSeeker ? fighterJobSeeker.goalContract : null}
        })
      }

      function managerDoesNotOwnRoundFighter(): boolean{
        return !manager.has.fighters.some(fighter => fighter.name == roundFighter.name)
      }
      function managerDoesNotKnowRoundFighter(): boolean{
        return !manager.has.knownFighters.some(knownFighter => knownFighter.name == roundFighter.name)
      }
    })
  }

  function addNewRoundToManagerLog(manager: Manager){
    manager.functions.addToLog({
      roundNumber,
      type: 'new round', message: `Round ${roundController.roundNumber}`});
  }

  function setRoundJobSeekers(){
    let { numberOfProfessionalJobSeekersPerRound, numberOfFighterJobSeekersPerRound } = gameConfiguration
    numberOfProfessionalJobSeekersPerRound += game.has.players.length - 2
    numberOfFighterJobSeekersPerRound += game.has.players.length - 2

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


    let numOfFighters: number = roundController.thisWeekIsEvent && 10 || gameConfiguration.fightersAfterRounds.reduce((num: number, roundFighters) => {
      if(roundFighters.round < roundController.roundNumber &&
        roundFighters.fighters > num
      ){
        return roundFighters.fighters
      } else return num
    }, null)



    
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
    randomFighters.forEach(f => f.state.fight = roundController.activeFight)

    roundController.lastFightFighters = randomFighters.map(fighter => fighter.name)


    roundController.activeFight.fightUiDataSubject.subscribe(() => {
      roundController.triggerUIUpdate()
    })
  }
  
}