
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import '../../styles/global.scss';

import {connect, Provider} from 'react-redux'
import { FrontEndState } from '../../front-end-state/front-end-state';
import { Login_View } from '../../views/login.view';
import Lobby_View from '../../views/lobby.view'
import Game_View from '../../views/game/game.view'
import { frontEndService } from '../../front-end-service/front-end-service';

interface MainGameProps{
  connectedToGameHost: boolean
  inGame: boolean
}

frontEndService.connectToGameHost()

const MainGame = ({
  connectedToGameHost, inGame
}: MainGameProps) => {


  if(!connectedToGameHost)
    return <Login_View />

  if(inGame == false)
    return <Lobby_View />

  if(inGame){
    return <Game_View />
  }    
}

const mapStateToProps = (
  {connectedToGameHost, inGame}: FrontEndState
): MainGameProps => ({connectedToGameHost, inGame})




const reactRenderingTag = document.createElement('react')
document.body.appendChild(reactRenderingTag)

const ConnectedGame = connect(mapStateToProps)(MainGame)


const render = () => {
  ReactDOM.render(
    <Provider store={frontEndService.frontEndStore}>
      <ConnectedGame/>
    </Provider>,
    reactRenderingTag
  );
};

render();

// Hot Module Replacement

declare let module: { hot: any };

if (module.hot) {
  module.hot.accept(MainGame, render);
}


