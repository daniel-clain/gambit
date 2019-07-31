import Fighter from '../../../classes/game/fighter/fighter';
import React from 'react';

type 

class Action{
  name: string
  arguments: any
}


class WS{
  socket: any
  sendAction(action: Action){
    this.socket.emit()

  }
}

class GF{
  constructor(private ws: WS){}
  trainFighter(trainerName: string, fighterName: string){
    this.ws.sendAction('Train Fighter', [trainerName, fighterName])
  }
}

class Client{
  ws: WS = new WS()
  gF: GF = new GF(this.ws)

  return(){
    <ManagerUI gf={this.gF}/>
  }
  
}

interface ManagerUIProps{
  gf: GF
}
class ManagerUI extends React.Component<ManagerUIProps>{
  render(){
    let fighterName: string
    let trainerName: string
    const gameFacade: GF = this.props.gf
    return <button onClick={() => gameFacade.trainFighter(trainerName, fighterName)}>Train Fighter</button>
  }
}