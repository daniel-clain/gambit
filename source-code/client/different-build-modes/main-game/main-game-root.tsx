import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { render } from 'react-dom'
import * as React from 'react';
import { Provider } from 'react-redux'
import { frontEndService } from '../../front-end-service/front-end-service';
import { MainGame } from './main-game';

frontEndService.setConnectionType('Websockets')
const reactRenderingTag = document.createElement('react')
document.body.appendChild(reactRenderingTag)
render(
  <Provider store={frontEndService.frontEndStore}>
    <MainGame />
  </Provider>
  , reactRenderingTag
)


