import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { render } from 'react-dom'
import * as React from 'react';
import { Provider } from 'react-redux'
import { FighterTest } from './fight-test';
import { fightUiService } from './fight-ui-service';

const reactRenderingTag = document.createElement('react')
document.body.appendChild(reactRenderingTag)
render(
  <Provider store={fightUiService.frontEndStore}>
    <FighterTest />
  </Provider>
  , reactRenderingTag
)

