
import { ExecutesWhenOptions } from '../manager/manager-options/manager-option';
import { IAbility, AbilityNames, AbilitySourceType, AbilityValidationError, AbilitySource, AbilityTarget } from './abilities';
import Game from '../game';
import { AbilityData } from '../../../client/components/manager-ui/client-abilities/client-ability.interface';


export default class OfferContract implements IAbility{
  name: AbilityNames = 'Offer contract'
  validSourceTypes: AbilitySourceType[] = ['Manager', 'Employee']
  source: AbilitySource;
  target: AbilityTarget;
  executesWhen: ExecutesWhenOptions = 'End Of Round';


  constructor(private game: Game){}
  
  execute(): string {
    throw new Error('Method not implemented.');
  }

  validateData(abilityData: AbilityData): AbilityValidationError{
    if(abilityData.source == undefined)
      return 'Offer contract source not defined'
    
    if(abilityData.source.type != 'Manager')
      return 'Offer contract source must be manager'
    
    if(abilityData.target == undefined)
      return 'Offer contract target not defined'
    
    
    return null
  }
  setSourceAndTarget(abilityData: AbilityData){

    if(abilityData.target.type == 'Job Seeker')
      this.target = this.game.jobSeekers.find(jobSeeker => jobSeeker.name == abilityData.target.name)
  }

}