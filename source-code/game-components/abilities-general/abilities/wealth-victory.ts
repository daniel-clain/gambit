import { Game } from "../../game"
import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"


const wealthVictory: Ability = {
  name: 'Wealth Victory',
  cost: { money: 200, actionPoints: 1 },
  possibleSources: ['Manager'],
  notValidTargetIf: [],
  validTargetIf: [],
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true,
  notActiveUntilRound: 20

}

export const wealthVictoryServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const manager = game.has.managers.find(manager => manager.has.name == abilityData.source.name)

    console.log(`${manager.has.name} has attempted a wealth victory`);

    if(
      manager.has.money >= averageOfOtherPlayersMoney() / 2 &&
      thisManagersLawyers() >= averageOfOtherPlayersLawyers() /2
    ){
      thisMangerHasWealthVictory()
    } else {
      thisManagerFailsWealthVictory()
    }

    // Implementation
    
    const otherManagers = game.has.managers
    .filter(m => m.has.name != manager.has.name)

    function averageOfOtherPlayersMoney(): number{
      return otherManagers.reduce((total, m) => total + m.has.money, 0)
    }
    function averageOfOtherPlayersLawyers(): number{
      return otherManagers.reduce((total, m) => {
        return total + m.has.employees.filter(e => e.profession == 'Lawyer').length
      }, 0)
    }

    function thisManagersLawyers(){
      return manager.has.employees.filter(e => e.profession == 'Lawyer').length
    }

    function thisMangerHasWealthVictory(){
      game.state.playerHasVictory = {
        name: manager.has.name,
        victoryType: 'Wealth Victory'
      }

    }

    function thisManagerFailsWealthVictory(){
      game.state.playerHasFailedVictory = {
        name: manager.has.name,
        victoryType: 'Sinister Victory'
      }

    }

    
  },
  ...wealthVictory
}

export const wealthVictoryClient: ClientAbility = {
  shortDescription: 'Win the game by financially crushing your opponents',
  longDescription: 'Win the game by financially crushing your opponents. Your opponents can counter your attempt to win if the average of their combined wealth or lawyers is more than half of yours. If you fail you will lose money equal to the average of their combined wealth',
  ...wealthVictory
}

