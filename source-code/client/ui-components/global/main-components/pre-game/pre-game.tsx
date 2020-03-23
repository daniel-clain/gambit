
import * as React from 'react';
export interface PreGameUIProps{
  tryToConnectToGameHost
}

export default class PreGame extends React.Component<PreGameUIProps>{ 


  render(){
    const {tryToConnectToGameHost} = this.props
    let inputName
    const updateName = (e) => {
      inputName = e.target.value
    }
    const submitName = () => {
      if(inputName != ''){
        localStorage.setItem('name', inputName)
        tryToConnectToGameHost()
      }
    }
    function clientIsGameDisplay(){
      tryToConnectToGameHost(true)
    }
    return (
        <div>
          <p>Is this client a game display?</p><button onClick={clientIsGameDisplay.bind(this)}>This is a game display</button>
          <hr/>
          <p>You must set your player name before you can connect.</p>
          <input id="name-input" placeholder="name" onInput={e => updateName(e)}/>
          <button id="submit-name-button" onClick={() => submitName()}>Submit</button>
        </div>
    )
  }
}

