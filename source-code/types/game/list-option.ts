import { AbilitySourceType } from "./ability-source-type";
import { AbilityTargetType } from "./ability-target-type";

export type ListOption = {
  name: string
  type: AbilitySourceType | AbilityTargetType
}