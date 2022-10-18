import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { useState } from 'react';
import { setNameAndTryToConnect } from '../../front-end-service/front-end-service';
import { frontEndState } from '../../front-end-state/front-end-state';

export const Login_View = observer(() => { 
  const {clientPreGameUIState} = frontEndState.clientUIState
  let [inputName, setInputName] = useState(clientPreGameUIState.clientName)


  return (
    <div className='login-ui'>    
        
      <div className='login-ui__content'> 
        <div className='login-ui__text'>You must set your player name before you can connect.</div>
        <input 
          id="name-input" 
          placeholder="name" 
          onKeyUp={({code}) => code == 'Enter' && setNameAndTryToConnect(inputName)}
          onChange={({target: {value}}) => setInputName(value)}
          value={inputName || ''}
        />
        <button id="submit-name-button" type='submit'
          onClick={() => setNameAndTryToConnect(inputName)}
        >Submit</button>
        
        <hr/>

        <div className='login-ui__text'>Is this client a game display?</div>
        <button 
          onClick={() => setNameAndTryToConnect('Game Display')}
        >This is a game display</button>
      </div>
    </div>
  )
})
