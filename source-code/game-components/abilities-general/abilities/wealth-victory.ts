import { Game } from "../../game"
import { Ability, ServerAbility, AbilityData } from "../ability"


export const wealthVictory: Ability = {
  disabled: false,
  name: 'Wealth Victory',
  cost: { money: 10000, actionPoints: 1 },
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true,
  notActiveUntilWeek: 20,
  canOnlyBeUsedOnce: true

}

export const wealthVictoryServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const manager = game.has.managers.find(manager => manager.has.name == abilityData.source.name)

    const otherManagers = game.has.managers
    .filter(m => m.has.name != manager.has.name)
    
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
      game.state.isShowingVideo = game.i.getSelectedVideo()

    }

    function thisManagerFailsWealthVictory(){
      game.state.playerHasFailedVictory = {
        name: manager.has.name,
        victoryType: 'Wealth Victory'
      }
      game.state.isShowingVideo = game.i.getSelectedVideo()

    }

    
  },
  ...wealthVictory
}