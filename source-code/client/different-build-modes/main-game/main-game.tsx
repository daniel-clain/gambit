
import * as React from 'react';
import '../../styles/global.scss';
import {Game_View} from '../../views/game/game.view'
import { initialSetup } from '../../front-end-service/front-end-service';
import { Login_View } from '../../views/pre-game/login.view';
import { Lobby_View } from '../../views/pre-game/lobby.view';
import { observer } from 'mobx-react';
import { frontEndState } from '../../front-end-state/front-end-state';
import { useEffect } from 'react';

initialSetup()

export const MainGame_C = observer(() => {

  const {
    serverUIState: { serverPreGameUIState },
    clientUIState: { clientPreGameUIState: {hasGameData} }
  } = frontEndState

  useEffect(() => {
    window.onbeforeunload = function() {
      return true
    };
  })

  const connectedToGameHost = !!serverPreGameUIState


  return hasGameData ? 
  <Game_View />
  : connectedToGameHost ? 
    <Lobby_View />
    : <Login_View /> 
       
})