import * as React from 'react';
import { frontEndService } from '../front-end-service/front-end-service';

export const Login_View = () => { 

  const {setName} = frontEndService().setClientState
  let inputName

  return (
    <div>    
        
      <p>You must set your player name before you can connect.</p>
      <input 
        id="name-input" 
        placeholder="name" 
        onInput={({currentTarget: {value}}) => inputName = value}
      />
      <button id="submit-name-button" 
        onClick={() => setName(inputName)}
      >Submit</button>
      
      <hr/>

      <p>Is this client a game display?</p>
      <button 
        onClick={() => setName('Game Display')}
      >This is a game display</button>
    </div>
  )
}
