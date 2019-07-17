
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import C_GameUI, { GameUIProps } from "../components/game-ui";
import IGameFacade from "../../classes/game-facade/game-facade";
import Game from '../../classes/game/game';


export interface LocalGameProps{
  game: IGameFacade
}

export default class C_LocalGame extends React.Component<LocalGameProps>{
  state: GameUIProps
  constructor(props: LocalGameProps){
    super(props)
    this.props.game.gameStateUpdates.subscribe(this.setState)
  }

  render(){
    const gameProps = this.state
    return <C_GameUI {...gameProps}/>
  }
}


const localGameProps: LocalGameProps = {game: new Game()}
ReactDOM.render(<C_LocalGame  {...localGameProps}/>, document.getElementById('react-rendering-div'))

