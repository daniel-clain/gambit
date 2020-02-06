

export type MoveAction = 
'retreat from flanked' | 
'retreat' | 
'cautious retreat' | 
'fast retreat' |
'move to attack' 

export type AttackResponseAction = 
'block' |
'dodge' |
'take hit'

export type CombatAction = 
'punch' |
'critical strike' |
'defend'

export type ActionName = 
MoveAction |
AttackResponseAction |
CombatAction |
'turn around' |
'recover' 


