
import * as React from 'react';
import '../../styles/global.scss';
import { connect, Provider } from 'react-redux'
import { FrontEndState } from '../../../interfaces/front-end-state-interface';
import {Game_View} from '../../views/game/game.view'
import { frontEndService } from '../../front-end-service/front-end-service';
import { hot } from 'react-hot-loader/root';
import { Login_View } from '../../views/pre-game/login.view';
import { Lobby_View } from '../../views/pre-game/lobby.view';
import { useEffect, useState } from 'react';

interface MainGameProps {
  connectedToGameHost: boolean
  inGame: boolean
  clientName: string
}

const MainGameComponent = ({
  connectedToGameHost, inGame, clientName
}: MainGameProps) => {

  if (
    frontEndService.connectionType == 'Websockets' &&
    !connectedToGameHost && 
    clientName
  ) {
    frontEndService.connectToGameHost()
  }
  return (
    !connectedToGameHost ?
      <Login_View /> :
      !inGame ?
        <Lobby_View /> :
        <Game_View />
  )
}

const mapStateToProps = ({
  serverUIState: { serverPreGameUIState, serverGameUIState },
  clientUIState: { clientPreGameUIState: { clientName } }
}: FrontEndState
): MainGameProps => ({ connectedToGameHost: !!serverPreGameUIState, inGame: !!serverGameUIState, clientName })

export const MainGame = connect(mapStateToProps)(hot(MainGameComponent))