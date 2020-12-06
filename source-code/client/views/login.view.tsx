import {frontEndService} from '../front-end-service/front-end-service'
import * as React from 'react';

export const Login_View = () => { 
  let {setName, connectToGameHost} = frontEndService
  let inputName
  return (
    <div>
      
      <p>You must set your player name before you can connect.</p>
      <input id="name-input" placeholder="name" onInput={e => updateName(e)}/>
      <button id="submit-name-button" onClick={() => submitName()}>Submit</button>
      
      <hr/>
      <p>Is this client a game display?</p><button onClick={clientIsGameDisplay.bind(this)}>This is a game display</button>
    </div>
  )
  function updateName(e){
    inputName = e.target.value
  }
  function submitName(){
    if(inputName != ''){
      localStorage.setItem('name', inputName)
      setName(inputName)
    }
    connectToGameHost()
  }
  function clientIsGameDisplay(){
    connectToGameHost()
  }
}
