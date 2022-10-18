import { managers } from "socket.io-client"
import { Game } from "../../game"
import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"


export const sinisterVictory: Ability = {
  name: 'Sinister Victory',
  cost: { money: 10000, actionPoints: 1 },
  executes: 'End Of Manager Options Stage',
  canOnlyTargetSameTargetOnce: true,
  notActiveUntilWeek: 20,
  canOnlyBeUsedOnce: true
}

export const sinisterVictoryServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const manager = game.has.managers.find(manager => manager.has.name == abilityData.source.name)

    console.log(`${manager.has.name} has attempted a sinister victory`);

    console.log('thisManagersThugAndHitmanStrength() :>> ', thisManagersThugAndHitmanStrength());
    console.log('averageOfOtherPlayersThugAndHitmanStrength() / 2 :>> ', averageOfOtherPlayersThugAndHitmanStrength() / 2);

    if(thisManagersThugAndHitmanStrength() > averageOfOtherPlayersThugAndHitmanStrength() / 2){
      thisMangerHasSinisterVictory()
    } else {
      thisManagerFailsSinisterVictory()
    }

    // Implementation

    function thisManagersThugAndHitmanStrength(): number{
      const thugCount = manager.has.employees.filter(e => e.profession == 'Thug').length
      const hitmanCount = manager.has.employees.filter(e => e.profession == 'Hitman').length
      return thugCount + (hitmanCount * 2)
    }

    function averageOfOtherPlayersThugAndHitmanStrength(): number{
      const otherManagers = game.has.managers
      .filter(m => m.has.name != manager.has.name)
      const totalThugHitmanStrength = otherManagers.reduce((total, m) => {
        const thugCount = m.has.employees?.filter(e => e.profession == 'Thug').length || 0
        const hitmanCount = m.has.employees?.filter(e => e.profession == 'Hitman').length || 0
        return total + thugCount + (hitmanCount * 2)
      }, 0)
      if(!totalThugHitmanStrength) return 0
      return totalThugHitmanStrength / otherManagers.length
    }

    function thisMangerHasSinisterVictory(){
      game.state.playerHasVictory = {
        name: manager.has.name,
        victoryType: 'Sinister Victory'
      }
      game.state.isShowingVideo = game.i.getSelectedVideo()
    }

    function thisManagerFailsSinisterVictory(){
      game.state.playerHasFailedVictory = {
        name: manager.has.name,
        victoryType: 'Sinister Victory'
      }
      game.state.isShowingVideo = game.i.getSelectedVideo()

    }

    
  },
  ...sinisterVictory
}
