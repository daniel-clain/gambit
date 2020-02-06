import { GameUiState } from "../interfaces/game-ui-state.interface"
import Manager, { ManagerInfo } from "./manager/manager"
import { RoundState } from "../interfaces/game/round-state"
import { FightState } from "./fight/fight"
import PlayerAction from "../interfaces/player-action"
import { Subject } from "rxjs"
import Game from "./game"
import { abilityProcessor, AbilityProcessor } from "./abilities-reformed/ability-processor"
import { AbilityData } from "./abilities-reformed/ability"


export default class UpdateCommunicatorGame{
  sendGameUiStateUpdate: Subject<GameUiState> = new Subject()
  abilityProcessor: AbilityProcessor
  private gameUiState: GameUiState = {
    roundStage: 'Manager Options',
    fightState: {
      startCountdown: null,
      timeRemaining: null,
      fighters: [],
      report: null
    },
    managerUiState: {
      managerInfo: null,
      managerOptionsTimeLeft: null,
      nextFightFighters: [],
      jobSeekers: [],
      delayedExecutionAbilities: []
    },
  }
  
  constructor(
    private game: Game,
    private manager: Manager    
  ){
    const {roundStateUpdateSubject, fightStateUpdatedSubject} = this.game.roundController

    this.abilityProcessor = abilityProcessor(game)

    roundStateUpdateSubject.subscribe(this.sendUpdate.bind(this))
    fightStateUpdatedSubject.subscribe(this.sendUpdate.bind(this))
    this.manager.managerUpdatedSubject.subscribe(() => {
      this.sendUpdate.bind(this)()
    })

    this.gameUiState.managerUiState.managerInfo = manager.info
  }
  
  receivePlayerAction(playerAction: PlayerAction): void {
    const {args} = playerAction
    switch(playerAction.name){
      case 'Ability Confirmed': 
        this.handleAbilitySelected(args); break;
      case 'Bet On Fighter':
        this.manager.nextFightBet = args; break;
      case 'Borrow Money':
        this.manager.borrowMoney(args.amount); break;
      case 'Payback Money':
        this.manager.paybackMoney(args.amount); break;
      case 'Toggle Ready':
        this.manager.readyForNextFight = args.ready; break;
    }
  }
  private handleAbilitySelected(selectedAbility: AbilityData){
    console.log('selectedAbility :', selectedAbility);
    this.abilityProcessor.processSelectedAbility(selectedAbility)
    this.sendUpdate()

  }


  private sendUpdate(){
    const {managerUiState} = this.gameUiState
    const {activeStage, activeFight, roundState} = this.game.roundController

    managerUiState.managerInfo = this.manager.info
    
    managerUiState.delayedExecutionAbilities = this.abilityProcessor.delayedExecutionAbilities

    if(activeStage == 'Fight Day')
      this.gameUiState.fightState = activeFight.fightState
    
    this.gameUiState.roundStage = roundState.stage

    managerUiState.managerOptionsTimeLeft = roundState.managerOptionsTimeLeft
    managerUiState.nextFightFighters = roundState.activeFight.fighters.map(
      fighter => fighter.name)
    managerUiState.jobSeekers = roundState.jobSeekers

    this.sendGameUiStateUpdate.next(this.gameUiState)

  }

}
