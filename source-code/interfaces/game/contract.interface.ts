export interface Contract{
  weeklyCost: number
  numberOfWeeks: number
}

export interface ActiveContract{
  costPerWeek: number
  weeksRemaining: number
  numberOfWeeks: number
}