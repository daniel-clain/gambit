
import OneToFive from '../../types/game/one-to-five.type';
import { ActiveContract } from '../../interfaces/game/contract.interface';
import Manager from '../manager/manager';
import Fight from "../fight/fight";



export default class FighterState{
  doping: boolean = false
  injured: boolean = false
  activeContract: ActiveContract = null
  manager: Manager
  fight: Fight
  
  private _happieness: OneToFive = 4  
  private _healthRating: OneToFive = 5
  private _publicityRating: OneToFive = 1

  numberOfFights: number = 0
  numberOfWins: number = 0

  private maxVal: 5
  private minVal: 1

  constructor(){}

  get happieness(){
    return this._happieness
  }
  get healthRating(){
    return this._healthRating
  }
  get publicityRating(){
    return this._publicityRating
  }

  set happieness(val){
    if(this.validateAttribute(val))
      this._happieness = val
  }
  set healthRating(val){
    if(this.validateAttribute(val))
      this._healthRating = val
  }
  set publicityRating(val){
    if(this.validateAttribute(val))
      this._publicityRating = val
  }

  private validateAttribute(attributeValue: number): boolean{
    let isValid: boolean = true;
    if(attributeValue < this.minVal){
      console.log(`Fighter attribute can not be below ${this.minVal}. Received: ${attributeValue}`);
      isValid = false
    }    
    if(attributeValue > this.maxVal){
      console.log(`Fighter attribute can not be above ${this.minVal}. Received: ${attributeValue}`);
      isValid = false
    }
    return isValid
  }


}


