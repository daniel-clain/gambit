
import * as React from 'react'
import ClientService from '../../../services/client.service';
import Button from '../../styled/button';
import Input from '../../styled/input';

type Props = {
  clientService: ClientService
}

export default class SetPlayerName extends React.Component<Props>{
  
  render(){
    let inputName
    const updateName = (e) => {
      inputName = e.target.value
    }
    const {clientService} = this.props
    return (
        <div>
          <p>You must set your player name before you can connect.</p>
          <Input id="name-input" placeholder="name" onInput={e => updateName(e)}></Input>
          <Button id="submit-name-button" onClick={() => clientService.setPlayerName(inputName)}>Submit</Button>
        </div>
    )
    
  }
}