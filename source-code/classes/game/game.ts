import {JobSeeker, EmployeeTypes} from './../../interfaces/game-ui-state.interface';

import Manager from "./manager/manager";
import { Subject } from 'rxjs';
import Player from './player';
import { PlayerInfo } from '../../interfaces/player-info.interface';
import {RoundController} from './round-controller/round-controller';
import Fighter from './fighter/fighter';
import gameConfiguration from './game-configuration';
import { shuffle, random } from '../../helper-functions/helper-functions';
import OptionsProcessor, { OptionNames, getOptionProcessors } from './manager/manager-options/manager-option';
import SkillLevel from '../../types/skill-level.type';
import AbilityProcessor from './abilities/ability-processor';
import { RoundState } from '../../interfaces/game/round-state';


export default class Game{

  gameFinishedSubject: Subject<void> = new Subject()

  roundController: RoundController
  fighters: Fighter[]
  players: Player[]
  managers: Manager[]
  jobSeekers: JobSeeker[]
  abilityProcessor: AbilityProcessor

	constructor(playerInfo: PlayerInfo[]) {   
    
    const shuffledNames: string[] = shuffle([...gameConfiguration.listOfNames])
    this.roundController = new RoundController(this) 
    this.abilityProcessor = new AbilityProcessor(this)
    this.createFighters(shuffledNames)
    this.createJobSeekers(shuffledNames)
    this.setupPlayersAndManagers(playerInfo)
    this.startGame()
    this.handleWhenGameFinished()
  }

  private startGame(){
    console.log('game started');
    this.roundController.startRound(1)
  }

  private handleWhenGameFinished(){
    this.roundController.roundStateUpdateSubject.subscribe(
      (roundState: RoundState) => {
        if(roundState.gameFinished){
          this.gameFinishedSubject.next()
        }
      }
    )   
  }

  private setupPlayersAndManagers(playerInfo: PlayerInfo[]){
    this.managers = []
    this.players = []
    playerInfo.forEach((playerInfo: PlayerInfo, index) => {
      const {socket, name, id} = playerInfo
      const playersManager: Manager = new Manager(`Manager${index}`)
      this.managers.push(playersManager)
      this.players.push(new Player(
        socket, name, id,
        this.roundController,
        playersManager,
        this.abilityProcessor
      ))
    }) 
  }

  private createFighters(shuffledNames){
    const amount: number = gameConfiguration.numberOfFighters
    const newFighters: Fighter[] = []
    for(;newFighters.length < amount;)
      newFighters.push(new Fighter(shuffledNames.pop()))

    this.fighters = newFighters
  }

  private createJobSeekers(shuffledNames){
    const amount: number = gameConfiguration.numberOfJobSeekers
    const jobSeekers: JobSeeker[] = []
    for(;jobSeekers.length < amount;){
      let type: EmployeeTypes
      let options: OptionNames[]
      switch(jobSeekers.length){
        case 0: case 1: type = 'Heavy'; options = ['Assault fighter']; break;
        case 2: case 3: type = 'Talent Scout'; options = ['Discover fighter', 'Research fighter']; break;
        case 4: case 5: type = 'Fitness Trainer'; options = ['Train fighter']; break;
        case 6: type = 'Hitman'; options = ['Assault fighter', 'Poison fighter']; break;
        case 7: type = 'Private Investigator'; options = ['Spy on manager', 'Research fighter']; break;
        case 8: type = 'Promoter'; options = ['Assault fighter']; break;
      }
      jobSeekers.push({
        name: shuffledNames.pop(),
        profession: type,
        type: 'Job Seeker',
        skillLevel: <SkillLevel>random(3, true),
        goalContract: {
          numberOfWeeks: 4,
          weeklyCost: 20
        }
      })
    }

    this.jobSeekers = jobSeekers
  }
    
}