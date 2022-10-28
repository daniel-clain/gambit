

import * as React from 'react';
import { MainGame_C } from './main-game';
import { render } from "react-dom";

console.log('Start Main Game Client');

render(<MainGame_C />, 
  document.body.appendChild(
    document.createElement('react-container')
  )
)
declare const module: any;
if (module.hot) {
  console.log('Hot module replacement active');
}
