

import * as React from 'react';
import { TestingGrounds_C } from './testing-grounds';
import { render } from "react-dom";

console.log('Start Main Game Client');

render(<TestingGrounds_C />, 
  document.body.appendChild(
    document.createElement('react-container')
  )
)
declare const module: any;
if (module.hot) {
  console.log('Hot module replacement active');
}
