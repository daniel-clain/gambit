
import 'regenerator-runtime/runtime'
import * as React from 'react';
import { render } from "react-dom";
import { FighterTest_C } from './fight-test';

const reactRenderingTag = document.createElement('react')
document.body.appendChild(reactRenderingTag)

console.log('Adding game to DOM');

render(<FighterTest_C />, 
  document.body.appendChild(
    document.createElement('react-container')
  )
)

