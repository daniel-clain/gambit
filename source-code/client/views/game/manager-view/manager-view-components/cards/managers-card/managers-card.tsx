import { KnownManager } from "../../../../../../../game-components/manager";
import {connect} from 'react-redux'
import { FrontEndState } from "../../../../../../front-end-state/front-end-state";
import ManagerCard from '../manager-card/manager-card'

interface ManagersCardProps{
  managers: KnownManager[]
  clientName: string
}

const ManagersCard = ({
  managers, clientName
}: ManagersCardProps) => managers.map(manager => 
  <ManagerCard {...{
    key: manager.name,
    manager, 
    isPlayersManager: manager.name == clientName
}}/>
)

const mapStateToProps = (({
  serverUIState: {serverGameUIState: {
    playerManagerUiData: {managerInfo}
  }},
  clientUIState: {clientPreGameUIState: {clientName}}
}: FrontEndState): ManagersCardProps => ({
  managers: [managerInfo, ...managerInfo.otherManagers], clientName
}))

export default connect(mapStateToProps)(ManagersCard)