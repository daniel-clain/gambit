import {IAbility, AbilityExecuteReport, AbilityValidationError, AbilityNames} from './abilities';
import Game from '../game';
import { ResearchFighter } from './research-fighter';
import { AbilityData } from '../../../client/components/manager-ui/client-abilities/client-ability.interface';
import OfferContract from './offer-contract';


export default class AbilityProcessor{
  delayedExecutionAbilities: IAbility[] = []

  constructor(private game: Game){}

  processSelectedAbility(selectedAbility: AbilityData): AbilityExecuteReport {
    console.log('ability processor ', selectedAbility.name);
    const ability: IAbility = this.getAbility(selectedAbility.name)
    const validationError: AbilityValidationError = ability.validateData(selectedAbility)
    if(validationError)
      return validationError

    ability.setSourceAndTarget(selectedAbility)



    if(ability.executesWhen == 'Instantly')
      return ability.execute()
    else
      this.delayedExecutionAbilities.push(ability)    
  }

  
  executeEndOfManagerOptionStageAbilities(): AbilityExecuteReport[]{
    return this.delayedExecutionAbilities
    .filter((deleyedAbility: IAbility) => 
      deleyedAbility.executesWhen == 'After Manager Options Stage')
    .map((deleyedAbility: IAbility) => deleyedAbility.execute())
  }
  executeEndOfRoundAbilities(): AbilityExecuteReport[]{
    return this.delayedExecutionAbilities
    .filter((deleyedAbility: IAbility) => 
      deleyedAbility.executesWhen == 'End Of Round')
    .map((deleyedAbility: IAbility) => deleyedAbility.execute())
  }

  getAbility(abilityName: AbilityNames): IAbility{
    switch(abilityName){
      case 'Research fighter' : return new ResearchFighter(this.game)
      case 'Offer contract' : return new OfferContract(this.game)
    }
  }

}