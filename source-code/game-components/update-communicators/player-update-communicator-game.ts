
import Manager from "../manager"
import PlayerAction from "../../interfaces/player-action"
import Game from "../game"
import { AbilityProcessor } from "../abilities-reformed/ability-processor"
import { AbilityData } from "../abilities-reformed/ability"
import UpdateCommunicatorGame from "./update-communicator-game"


export default class PlayerUpdateCommunicatorGame extends UpdateCommunicatorGame{
 
  constructor(
    game: Game,
    private manager: Manager,
    private abilityProcessor: AbilityProcessor
  ){
    super(game)
    this.playerGameUiData.playerManagerUiData.managerInfo = manager.info
    this.manager.managerUpdatedSubject.subscribe(this.sendUpdate.bind(this))
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


  protected sendUpdate(){
    const {playerManagerUiData} = this.playerGameUiData
    playerManagerUiData.managerInfo = this.manager.info    
    playerManagerUiData.delayedExecutionAbilities = this.abilityProcessor.delayedExecutionAbilities
    
    super.sendUpdate()
  }

}
