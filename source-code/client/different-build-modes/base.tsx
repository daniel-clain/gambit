
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import '../styles/global.scss';

import {connect, Provider} from 'react-redux'
import { FrontEndState } from '../front-end-state/front-end-state';
import { Store } from 'redux';


declare let module: { hot: any };

export interface MainGameProps{
  connectedToGameHost: boolean
  inGame: boolean
  clientName: string
}

export const withBase = (BuildModeComponent, frontEndStore: Store<FrontEndState>) => {

  const mapStateToProps = ({
    serverUIState: {serverPreGameUIState, serverGameUIState},
    clientUIState: {clientPreGameUIState: {clientName}}
  }: FrontEndState
  ): MainGameProps => ({connectedToGameHost: !!serverPreGameUIState, inGame: !!serverGameUIState, clientName})


  const reactRenderingTag = document.createElement('react')
  document.body.appendChild(reactRenderingTag)

  const ConnectedGame = connect(mapStateToProps)(BuildModeComponent)


  const render = () => {
    ReactDOM.render(
      <Provider store={frontEndStore}>
        <ConnectedGame/>
      </Provider>,
      reactRenderingTag
    );
  };

  render();

  if (module.hot) {
    module.hot.accept(ConnectedGame, render);
  }
}


