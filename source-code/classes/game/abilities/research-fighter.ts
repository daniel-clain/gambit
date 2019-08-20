

import {ExecutesWhenOptions} from './../manager/manager-options/manager-option';
import {FighterInfo, EmployeeTypes, Employee} from './../../../interfaces/game-ui-state.interface';
import {IAbility, AbilityExecuteReport, AbilityValidationError, AbilityNames, AbilitySourceType, AbilitySource} from './abilities';
import Game from '../game';
import {  AbilityData } from '../../../client/components/manager-ui/client-abilities/client-ability.interface';
import Fighter from '../fighter/fighter';
import Manager from '../manager/manager';

export class ResearchFighter implements IAbility{
  
  name: AbilityNames = 'Research fighter'
  executesWhen: ExecutesWhenOptions = 'Instantly'
  validSourceTypes: AbilitySourceType[] = ['Manager', 'Employee']

  source: AbilitySource

  constructor(private game: Game){}

  target: Fighter
  
  validateData(abilityData: AbilityData): AbilityValidationError{
    if(abilityData.source == undefined)
      return 'Offer contract source not defined'    
    
    if(abilityData.target == undefined)
      return 'Offer contract target not defined'
    
    return null
  }


  setSourceAndTarget(abilityData: AbilityData){
    this.target = this.game.fighters.find((fighter: Fighter) => fighter.name == abilityData.target.name)
    
    if(abilityData.source.type == 'Manager')
      this.source = this.game.managers.find((manager: Manager) => manager.name == abilityData.source.name)
    else{
      this.source = this.game.managers.reduce((employee, manager: Manager) => {
        if(employee){
          return employee
        }
        const foundEmployee: Employee = manager.employees.find(employee => employee.name == abilityData.source.name)
        if(foundEmployee){
          return foundEmployee
        }
      }, null)
    }
  }

  execute(): AbilityExecuteReport{
    const fighterInfo: FighterInfo = this.target.getInfo()
    let knownFighters: FighterInfo[]
    if(this.source.type == 'Manager'){
      const manager = this.source as Manager
      knownFighters = manager.knownFighters
    }
    else{
      const employee = this.source as Employee
      knownFighters = employee.manager.knownFighters
    }
    const existingFighterIndex = knownFighters.findIndex(fighter => fighter.name == this.target.name)
    if(existingFighterIndex >= 0)
      knownFighters[existingFighterIndex] = fighterInfo
    else
      knownFighters.push(fighterInfo)

    console.log(`${this.source.name} used research fighter to find info about ${this.target.name}`);
    
    return 'great success'
  }

}







