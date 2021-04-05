import * as React from 'react';
import { useState } from 'react';
import {frontEndService} from '../front-end-service/front-end-service';

export const Login_View = () => { 

  const {setClientState} = frontEndService 
  let [inputName, setInputName] = useState(localStorage.getItem('clientName'))

  const setNameAndTryToConnect = name => {
    setClientState.setName(name)
    frontEndService.connectToGameHost()
  }

  return (
    <div className='login-ui'>    
        
      <div className='login-ui__content'> 
        <div className='login-ui__text'>You must set your player name before you can connect.</div>
        <input 
          id="name-input" 
          placeholder="name" 
          onKeyUp={({code}) => code == 'Enter' && setNameAndTryToConnect(inputName)}
          onInput={({currentTarget: {value}}) => setInputName(value)}
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
}
