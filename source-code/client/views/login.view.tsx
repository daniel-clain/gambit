import {frontEndService} from '../front-end-service/front-end-service'
import * as React from 'react';
import {Dispatch} from 'redux'
import {useDispatch} from 'react-redux'
import { PreGameUIAction } from '../front-end-state/reducers/pre-game-ui.reducer';

export const Login_View = () => { 

  const dispatch: Dispatch<PreGameUIAction> = useDispatch()
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
        onClick={() => dispatch({type:'Set Name', payload: inputName})}
      >Submit</button>
      
      <hr/>

      <p>Is this client a game display?</p>
      <button 
        onClick={() => dispatch({type:'Set Name', payload: inputName})}
      >This is a game display</button>
    </div>
  )
}
