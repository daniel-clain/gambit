
import { ifSourceIsManager, ifSourceIsEmployee, ifTargetIsFighter, ifTargetIsJobSeeker, ifTargetIsManager } from "../../client/front-end-service/ability-service-client"
import { SourceTypes } from "./ability"
import { Manager } from '../manager';
import { Game } from "../game";
import { Profession } from "../../types/game/profession";

export function getAbilitySourceManager(source: SourceTypes, game: Game): Manager{
  let manager: Manager
  ifSourceIsManager(source, (managerInfo) => {
    manager = game.has.managers.find(manager => manager.has.name == managerInfo.name)
  })
  
  ifSourceIsEmployee(source, () => 
    manager = game.has.managers.find(manager => 
      manager.has.employees.some(employee => employee.name == source.name)
    )
  )
  return manager
}

export function getSourceType(source): 'Manager' | Profession{
  let sourceType: 'Manager' | Profession
  ifSourceIsManager(source, () => sourceType = 'Manager')
  ifSourceIsEmployee(source, employee => sourceType = employee.profession)
  return sourceType

}
export function getTargetType(target) {
  let targetType: 'Manager' | 'Job Seeker' | 'Fighter'
  ifTargetIsManager(target, () => targetType = 'Manager')
  ifTargetIsJobSeeker(target, () => targetType = 'Job Seeker')
  ifTargetIsFighter(target, () => targetType = 'Fighter')
  return targetType
}