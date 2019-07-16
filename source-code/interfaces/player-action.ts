import { ManagerOptionNames } from "../classes/game/manager/managerOptions/manager-option";

export default interface PlayerAction{
  playerId: string
  name: ManagerOptionNames
  arguments: any[]
}