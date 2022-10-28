import { Game } from "../../game"
import { Ability, ServerAbility, AbilityData } from "../ability"
import { getAbilitySourceManager } from "../ability-service-server"


export const giveUp: Ability = {
  name: 'Give Up',
  cost: { money: 0, actionPoints: 0 },
  executes: 'Instantly'
}

export const giveUpServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const manager = getAbilitySourceManager(abilityData.source, game)

    
    console.log(`${manager.has.name} has given up`);
    manager.state.retired = true

    game.has.weekController.preFightNewsStage.newsItems.push({
      newsType: 'manager retired',
      headline: `${manager.has.name} Retired!`,
      message: `${manager.has.name} has no money and has given up`
    })
    
  },
  ...giveUp
}