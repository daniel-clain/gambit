import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { render } from 'react-dom'
import * as React from 'react';
import { Provider } from 'react-redux'
import { frontEndStore } from '../../front-end-state/front-end-state';
import { frontEndService } from '../../front-end-service/front-end-service';
import { MainGame } from '../main-game/main-game';

frontEndService.setConnectionType('Local')
const reactRenderingTag = document.createElement('react')
document.body.appendChild(reactRenderingTag)
render(
  <Provider store={frontEndStore}>
    <MainGame />
  </Provider>
  , reactRenderingTag
)

