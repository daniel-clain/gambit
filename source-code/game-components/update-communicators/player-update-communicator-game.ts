
import Manager from "../manager"
import Game from "../game"
import { AbilityProcessor } from "../abilities-reformed/ability-processor"
import { AbilityData } from "../abilities-reformed/ability"
import UpdateCommunicatorGame from "./update-communicator-game"
import ClientGameAction from "../../types/client-game-actions"


export default class PlayerUpdateCommunicatorGame extends UpdateCommunicatorGame{
 
  constructor(
    game: Game,
    protected manager: Manager,
    private abilityProcessor: AbilityProcessor
  ){
    super(game, manager)
    this.playerGameUiData.playerManagerUiData.managerInfo = manager.getInfo()
  }
  
  receivePlayerAction( gameAction: ClientGameAction): void {
    const {data} = gameAction
    switch( gameAction.name){
      case 'Ability Confirmed': 
        this.handleAbilitySelected(data); break;
      case 'Bet On Fighter':
        this.manager.nextFightBet = data; break;
      case 'Borrow Money':
        this.manager.borrowMoney(data.amount); break;
      case 'Payback Money':
        this.manager.paybackMoney(data.amount); break;
      case 'Toggle Ready':
        this.manager.readyForNextFight = data.ready; break;
      case 'Toggle Drop Player':
        this.game.disconnectedPlayers.playerVoteToggle(data.votingPlayer, data.disconnectedPlayer, data.vote); break;
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
