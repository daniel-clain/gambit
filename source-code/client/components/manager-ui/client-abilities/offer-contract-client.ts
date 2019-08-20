import {JobSeeker} from './../../../../interfaces/game-ui-state.interface';
import IClientAbility, { AbilityData } from './client-ability.interface';
import OfferContract from '../../../../classes/game/abilities/offer-contract';
import { ManagerInfo } from '../../../../classes/game/manager/manager';
import { AbilityValidationError } from '../../../../classes/game/abilities/abilities';


export class OfferContractClient extends OfferContract implements IClientAbility{
  shortDescription: `
  offer contract of employment to job seeker
  `
  longDescription: ``

  constructor(){
    super(null)
  }


  isValidTarget(jobSeeker: JobSeeker, managerInfo: ManagerInfo): boolean {    
    if(jobSeeker.goalContract == undefined){
      return false
    }
    return true
  }



}