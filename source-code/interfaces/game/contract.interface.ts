export interface GoalContract{
  weeklyCost: number
  numberOfWeeks: number
}

export interface ActiveContract{
  weeklyCost: number
  weeksRemaining: number
}

export interface ContractOffer{
  numberOfWeeks: number
  weeklyCost: number
}