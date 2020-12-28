import * as React from 'react';
import { KnownManager } from "../../../../../../../game-components/manager";
import {connect} from 'react-redux'
import { FrontEndState } from "../../../../../../front-end-state/front-end-state";
import ManagerCard from '../manager-card/manager-card'
import { Modal } from '../../partials/modal/modal';
import './managers-card.scss'

interface ManagersCardProps{
  managers: KnownManager[]
  clientName: string
}

const ManagersCard = ({
  managers, clientName
}: ManagersCardProps) => {
  
  return <Modal>
    <div className='card'>
      <div className='heading'>Managers</div>
      <div className="managers-container">
        {managers.map(manager => 
          <div className="manager">              
            <div className={`manager__image manager__image--${manager.image.toLowerCase().replace(' ', '-')}`}></div>
            <div className="manager__name">{
              `${manager.name == clientName ? '****' : ''} ${manager.name} `
            }</div>
          </div>
        )}
      </div>
    </div>
  </Modal>
}



const mapStateToProps = (({
  serverUIState: {serverGameUIState: {
    playerManagerUIState: {managerInfo}
  }},
  clientUIState: {clientPreGameUIState: {clientName}}
}: FrontEndState): ManagersCardProps => ({
  managers: [managerInfo, ...managerInfo.otherManagers], clientName
}))

export default connect(mapStateToProps)(ManagersCard)