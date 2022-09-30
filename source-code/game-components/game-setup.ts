import { Employee, FightUIState, GameFinishedData, Professional, SelectedVideo } from "../interfaces/front-end-state-interface";
import gameConfiguration from "../game-settings/game-configuration";
import { numberLoop, random, shuffle } from "../helper-functions/helper-functions";
import { Profession } from "../types/game/profession";
import SkillLevel from "../types/game/skill-level.type";
import Fighter from "./fighter/fighter";
import { Game } from "./game";
import { Manager } from "./manager";
import { VideoName } from "../client/videos/videos";

export class Game_Implementation{
  shuffledNames: string[]

  constructor(public game: Game){}

  setupFightersAndProfessionals(){
    this.shuffledNames = shuffle([...gameConfiguration.listOfNames.filter(name => !this.game.has.players.some(p => p.name == name))])
    
    this.game.has.professionals = this.createRandomProfessionals()
    this.game.has.fighters = this.createRandomFighters()
  }


  createRandomFighters(): Fighter[]{
    const {baseFightersCount} = gameConfiguration

    const newFighters: Fighter[] = []
    for(;newFighters.length < baseFightersCount;){
      const newFighter = new Fighter(this.shuffledNames.pop())
      newFighter.fighting.stats.baseStrength = random(5, true)
      newFighter.fighting.stats.baseFitness = random(5, true)
      newFighter.fighting.stats.baseAggression = random(5)
      newFighter.fighting.stats.baseIntelligence = random(10, true)

      newFighter.fighting.reset()
      newFighters.push(newFighter)
      
    }
    console.log('newFighters :>> ', newFighters.length);

    generateFighterHistory()
    return newFighters

    function generateFighterHistory(){
      const numberOfFights = newFighters.length * 5
  
      for (let fight = 0; fight < numberOfFights; fight++) {
        const randomNumberOfFightersInTheFight = random(3, true) + 1
  
  
        let randomFighters: Fighter[] = []
        for (; randomFighters.length != randomNumberOfFightersInTheFight; ) {
          const randomFighterIndex = random(newFighters.length - 1)
          const randomFighter = newFighters[randomFighterIndex]
          const fighterAlreadyInList = randomFighters.some(fighter => fighter.name == randomFighter.name)
  
          if(fighterAlreadyInList) continue
  
          randomFighters.push(randomFighter)
          
        }
  
        randomFighters.forEach(fighter => fighter.state.numberOfFights++)
  
        const fightersChanceToWin = randomFighters.map(fighter => {
          const {fitness, strength, aggression, intelligence} = fighter.fighting.stats
          return {
            fighter,
            chance: Math.round(fitness + strength + (aggression / 2) + intelligence)
          }
        })
  
        const totalProbability: number = fightersChanceToWin.reduce(
          (totalProbability, {chance}) =>
            totalProbability + chance, 0)
  
  
        const randomNum = random(totalProbability, true)
        let probabilityRange: number = 0;
  
  
        let fightWinner: Fighter
        for (let {fighter, chance} of fightersChanceToWin) {
          if (
            randomNum > probabilityRange &&
            randomNum <= probabilityRange + chance
          ){
            fightWinner = fighter
            break
          }
          else
            probabilityRange += chance
        }
        if(!fightWinner)
          throw console.error('There should have been a fight winner', fightersChanceToWin)
  
        fightWinner.state.numberOfWins++
        
      }
    }
    
  }

  
  createRandomProfessionals(): Professional[]{
    
    
    const numberOfProfessionals = gameConfiguration.baseProfessionalsCount

    const {shuffledNames} = this

    const professionals: Professional[] = (
      Object.keys(gameConfiguration.professionalTypeProbability)
      .reduce((professionals, profession: Profession): Professional[] => {
        console.log('profession :>> ', profession);
        const {minimum} = gameConfiguration.professionalTypeProbability[profession]
        console.log('minimum :>> ', minimum);
        return [
          ...professionals, 
          ...numberLoop(minimum, () => 
            new Professional(
              profession, 
              <SkillLevel>random(3, true), 
              this.shuffledNames.pop()
            )
          )
        ]
      }, [])
    )
      
    
    for(;professionals.length < numberOfProfessionals;){
      professionals.push(getRandomProfessional())
    }

    console.log('professionals Lawyer :>> ', professionals.filter(p => p.profession == 'Lawyer').length);
    console.log('professionals Hitman :>> ', professionals.filter(p => p.profession == 'Hitman').length);
    console.log('professionals Thug :>> ', professionals.filter(p => p.profession == 'Thug').length);
    console.log('professionals Talent :>> ', professionals.filter(p => p.profession == 'Talent Scout').length);
    return professionals

    
    function getRandomProfessional(): Professional {
      
      return createProfessional(getRandomProfession())
      
      function getRandomProfession(): Profession {
        let totalProbability = 0
        
        for( let profession in gameConfiguration.professionalTypeProbability){
          totalProbability += gameConfiguration.professionalTypeProbability[profession].probability
        }
        const randomNumber = random(totalProbability, true)
        console.log('randomNumber :>> ', randomNumber);
        let probabilityRange = 0
        for ( let profession in gameConfiguration.professionalTypeProbability) {
          if (
            randomNumber > probabilityRange &&
            randomNumber <= probabilityRange + gameConfiguration.professionalTypeProbability[profession].probability
          ){
            console.log('professionxx :>> ', profession);
            return profession as Profession
          }
          else
            probabilityRange += gameConfiguration.professionalTypeProbability[profession].probability
        }
      }
    }

    function createProfessional(profession: Profession){
      return new Professional(profession, <SkillLevel>random(3, true), shuffledNames.pop())

    }
  }

  getAllConnectedGameDisplays(){
    
    return this.game.has.gameDisplays?.filter(gameDisplay => !this.game.has.connectionManager.disconnectedPlayerVotes
      .find(d => d.disconnectedPlayer.id == gameDisplay.id))
  }


  removeFighterFromTheGame = (fighterName, game: Game) => {
    const fighter = game.has.fighters.find(fighter => fighter.name == fighterName)
    fighter.state.dead = true
  
    game.has.managers.forEach(manager => {
      const {fighters, knownFighters} = manager.has
      fighters.splice(
        fighters.findIndex(f => f.name == fighterName), 1
      )
      knownFighters.splice(
        fighters.findIndex(f => f.name == fighterName), 1
      )
    })
  
    const {fighters} = game.has.roundController.activeFight
    fighters.splice(
      fighters.findIndex(f => f.name == fighterName), 1
    )
  }

  resignEmployee(employee: Employee, manager?: Manager){
    const employeesManager = manager || this.game.has.managers.find(m => m.has.employees.some(e => e.name == employee.name))

    if(!employeesManager) return console.error(`tried to find manager of resigning employee but failed. ${employee.name}`)
    employeesManager.has.employees = employeesManager.has.employees.filter(e => e.name != employee.name)

    const {actionPoints, activeContract, ...rest} = employee

    this.game.has.professionals.push(rest)
  }

  getSelectedVideo(): SelectedVideo{
    const {playerHasVictory, playerHasFailedVictory} = this.game.state
    const name: VideoName = (() => {
      if(playerHasVictory){
        switch(playerHasVictory.victoryType){
          case 'Sinister Victory': return 'Sinister Victory'
          case 'Wealth Victory': return 'Wealth Victory'
          case 'Domination Victory': return 'Domination Victory'
        }
      }
      if(playerHasFailedVictory){
        switch(playerHasFailedVictory.victoryType){
          case 'Sinister Victory': return 'Sinister Victory Fail'
          case 'Wealth Victory': return 'Wealth Victory Fail'
        }
      }
    })()
    const videos = gameConfiguration.videos.find(v => v.name == name)!.videos
    const index = random(videos.length - 1)

    return {name, index}
  }

  getFightUiState(manager?: Manager): FightUIState{
    const {has:{roundController}, state:{finalTournament}} = this.game
    
    if(finalTournament){
      const {activeFight} = finalTournament
      const finalTournamentFight = {
        ...activeFight?.fightUiData, 
        knownFighterStates: 
          !activeFight ? [] : manager?.functions.getKnownFighterStats(activeFight?.fighters)
      }
      return finalTournamentFight
    }
    const roundFight = {
      ...roundController.activeFight?.fightUiData, 
      knownFighterStates: 
        !roundController.activeFight ? [] : manager?.functions.getKnownFighterStats(roundController.activeFight?.fighters)
    }
    return roundFight
  }

  getGamFinishedData(): GameFinishedData | null{
    const {state, has} = this.game
    if(state.gameIsFinished){
      const winner = {
        name: state.playerHasVictory.name,
        victoryType: state.playerHasVictory.victoryType,
        image: has.managers.find(m => m.has.name == state.playerHasVictory.name).has.image
      }
      const players = has.managers.map(m => {
        return {
          name: m.has.name,
          money: m.has.money
        }
      })
      return {winner, players}
    } else {
      return null
    }
  }

}
