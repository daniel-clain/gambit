

export default interface PlayerAction{
  name: PlayerActionNames
  args: any
}

type PlayerActionNames = 'Ability Confirmed' | 'Bet On Fighter' | 'Borrow Money' | 'Payback Money' | 'Toggle Ready' | 'Submit Round Actions'