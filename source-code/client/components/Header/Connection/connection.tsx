
import * as React from 'react'
import ConnectionStates from '../../../../types/connection-states';
import styled from 'styled-components'

type Props = {
  connectionState: ConnectionStates
}

const ConnectionStyle = styled.span`
  margin: 0 1rem;
`

export default class Connection extends React.Component<Props>{

  render(){
    return <ConnectionStyle id='connection-state'>Connection State: <span className='value'>{this.props.connectionState}</span></ConnectionStyle>
    
  }
}