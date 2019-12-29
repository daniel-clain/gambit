import { GameUiState } from "../interfaces/game-ui-state.interface"
import ClientId from "../types/client-id.type"
import ClientName from "../types/client-name.type"
import { RoundController } from "./round-controller/round-controller"
import Manager, { ManagerInfo } from "./manager/manager"
import { AbilityData } from "../interfaces/game/client-ability.interface"
import { RoundState } from "../interfaces/game/round-state"
import { FightState } from "./fight/fight"
import AbilityProcessor from "./abilities/ability-processor"
import PlayerAction from "../interfaces/player-action"
import { Socket } from "socket.io"


export default class Player{
  
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
      notifications: []
    },
  }
  
  constructor(
    private socket: Socket, 
    private id: ClientId, 
    private name: ClientName,
    private roundController: RoundController,
    private manager: Manager,  
    private abilityProcessor: AbilityProcessor
  ){
    this.socket.on('Action From Player', this.handleActionsFromClient.bind(this))

    this.roundController.roundStateUpdateSubject.subscribe(this.receiveRoundUpdate.bind(this))
    this.roundController.fightStateUpdatedSubject.subscribe(this.receiveFightUpdate.bind(this))
    this.manager.managerUpdatedSubject.subscribe(this.receiveManagerUpdate.bind(this))

    this.gameUiState.managerUiState.managerInfo = manager.info
  }

  handleActionsFromClient(playerAction: PlayerAction){
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
  handleAbilitySelected(selectedAbility: AbilityData){
    console.log('selectedAbility :', selectedAbility);
    this.abilityProcessor.processSelectedAbility(selectedAbility)
  }

  private receiveRoundUpdate(roundState: RoundState){ 
    const {managerUiState} = this.gameUiState
    this.gameUiState.roundStage = roundState.stage
    managerUiState.managerOptionsTimeLeft = roundState.managerOptionsTimeLeft
    managerUiState.nextFightFighters = roundState.activeFight.fighters.map(
      fighter => fighter.getInfo())
    managerUiState.jobSeekers = roundState.activeJobSeekers
    this.emitGameUIStateUpdate()
  }

  private receiveFightUpdate(fightState: FightState){ 
    this.gameUiState.fightState = fightState
    this.emitGameUIStateUpdate()
  }

  private receiveManagerError(error: string){ 
    const {managerUiState} = this.gameUiState
    managerUiState.notifications.push(error)
  }

  private receiveManagerUpdate(managerInfo: ManagerInfo){
    this.gameUiState.managerUiState.managerInfo = managerInfo
    this.emitGameUIStateUpdate()
  }

  private emitGameUIStateUpdate(){
    this.socket.emit('Game UI State Update', this.gameUiState)
  }

}
