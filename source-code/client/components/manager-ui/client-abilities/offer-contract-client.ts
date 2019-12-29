import {JobSeeker} from './../../../../interfaces/game-ui-state.interface';
import IClientAbility, { AbilityData } from '../../../../interfaces/game/client-ability.interface';
import OfferContract from '../../../../game-components/abilities/offer-contract';
import { ManagerInfo } from '../../../../game-components/manager/manager';


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