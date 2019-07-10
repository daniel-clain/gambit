import Fighter from "./fighter";

export class FighterCombatStates{
  fightersInfront: Fighter[]
  fightersBehind: Fighter[] 
  fighterAttackingYou: Fighter
  fighterTargetedForAttack: Fighter
  retreatingFromFighter: Fighter
}