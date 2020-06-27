import ClientAction from "../interfaces/client-action";


export default interface ClientGameAction extends ClientAction{
  name: ClientActionNamesGame
}

export type ClientActionNamesGame = 'Ability Confirmed' | 'Bet On Fighter' | 'Borrow Money' | 'Payback Money' | 'Toggle Ready' | 'Submit Round Actions' | 'Toggle Drop Player'