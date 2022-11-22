export const attackActions = ['critical strike', 'punch'] as const

export type AttackAction = typeof attackActions[number]

export const attackResponseActions = ['block', 'dodge','take hit'] as const

export type AttackResponseAction = typeof attackResponseActions[number]


export const moveActions = ['strategic retreat', 'cautious retreat', 'desperate retreat', 'move to attack'] as const

export type MoveAction = typeof moveActions[number]



export const combatActions = [...attackActions, 'defend'] as const

export type CombatAction = typeof combatActions[number]


export const miscActions = ['check flank', 'recover', 'do nothing'] as const

export type MiscAction = typeof miscActions[number]

export type MainActionName = 
  AttackResponseAction |
  MoveAction |
  AttackResponseAction |
  CombatAction |
  MiscAction

export type InterruptAction = `${AttackResponseAction} main`

export type InstantActionName =
  'recover' | 'turn around' | AttackAction | AttackResponseAction


export type WarmupAction = `${'turn around' | AttackAction } warmup`

export type CooldownAction = `${'turn around' | AttackAction | AttackResponseAction} cooldown`

export type PreAttackAction = `pre ${AttackAction}`
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




export type InterruptibleActionName = 
  'move' | 'recover' | 'do nothing' | 'defend' |
  AttackResponseAction |
  WarmupAction |
  CooldownAction | 
  PreAttackAction |
  PostAttackHitAction |
  PostAttackMissAction
  


