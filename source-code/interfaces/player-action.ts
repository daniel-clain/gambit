

export default interface PlayerAction{
  name: PlayerActionNames
  args: any
}

type PlayerActionNames = 'Add Manager Action' | 'Bet On Fighter' | 'Borrow Money' | 'Payback Money' | 'Toggle Ready'