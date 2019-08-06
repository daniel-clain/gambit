

export default interface PlayerAction{
  name: PlayerActionNames
  args: any
}

type PlayerActionNames = 'Option Confirmed' | 'Bet On Fighter' | 'Borrow Money' | 'Payback Money' | 'Toggle Ready'