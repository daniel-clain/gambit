export const attackActions = ["kick", "punch"] as const

export type AttackAction = (typeof attackActions)[number]

export const attackResponseActions = ["block", "dodge", "take hit"] as const

export type AttackResponseAction = (typeof attackResponseActions)[number]

export const retreatActions = [
  "strategic retreat",
  "desperate retreat",
  "cautious retreat",
] as const

export const afflictionActions = [
  "be sick",
  "flinch",
  "hallucinations",
] as const

export type AfflictionActions = (typeof afflictionActions)[number]

export type RetreatAction = (typeof retreatActions)[number]

export const moveActions = [...retreatActions, "move to attack"] as const

export type MoveAction = (typeof moveActions)[number]

export const combatActions = [...attackActions, "defend"] as const

export type CombatAction = (typeof combatActions)[number]

export const miscActions = ["check flank", "recover", "do nothing"] as const

export type MiscAction = (typeof miscActions)[number]

// only used for debugging by setting logs
export type DecideActionName =
  | MoveAction
  | CombatAction
  | MiscAction
  | AfflictionActions

export type WarmupAction = `${"turn around" | AttackAction} warmup`

export type CooldownAction = `${
  | "turn around"
  | AttackAction
  | AttackResponseAction} cooldown`

export type PostAttackHitAction = `post ${AttackAction} hit`
export type PostAttackMissAction = `post ${AttackAction} miss`

/* 
  attack warmup
  attack cooldown
  turn warmup
  turn cooldown
  pre punch
  post punch hit
  post punch miss

*/

export const canDefendActions = [
  "move",
  "recover",
  "do nothing",
  "defend",
] as const

export type CanDefendAction = (typeof canDefendActions)[number]

export type ActionName =
  | MoveAction
  | AttackResponseAction
  | WarmupAction
  | CooldownAction
  | PostAttackHitAction
  | PostAttackMissAction
  | CombatAction
  | MiscAction
  | AfflictionActions
  | "knocked out"
  | "victory"
