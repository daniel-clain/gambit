
import { SourceTypes } from "./ability"
import { Manager } from '../manager';
import { Game } from "../game";
import { Employee } from "../../interfaces/front-end-state-interface";

export function getAbilitySourceManager(source: SourceTypes, game: Game): Manager{
  return (
    (
      source.characterType == 'Manager' &&
      game.has.managers.find(manager => manager.has.name == source.name)!
    ) || (
      game.has.managers.find(manager => 
        manager.has.employees.some(employee => employee.name == source.name)
      )!
    )
  )
  
}