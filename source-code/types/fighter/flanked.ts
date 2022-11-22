import Fighter from "../../game-components/fighter/fighter"
import { Angle } from "../game/angle"

export type Flanked = {
  flankers: Fighter[]
}

export type PersistPastFlanker = {
  direction: Angle
  flanker: Fighter
}