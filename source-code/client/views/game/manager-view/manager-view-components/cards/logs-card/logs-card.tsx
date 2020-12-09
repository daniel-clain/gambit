import { Modal_Partial } from "../../partials/modal/modal"

interface LogsCardProps{
  activityLogs
}
const LogsCard = ({activityLogs}: LogsCardProps) => {
  const reversedLog = [...activityLogs].reverse()
  return <Modal_Partial>
      <div className='panel activity-log'>
        <div className='heading'>Activity Log</div>
        <div className='list'>
          {reversedLog.map((logItem, index) => 
            <div 
            className={`list__row 
              list__row--${
                logItem.type == 'critical' ? 'critical' : 
                logItem.type == 'new round' ? 'new-round' :
                index % 2 == 1 ? 'main-color' : 'alternate-color'
              }`} 
            key={index}>{logItem.message}</div>
          )}
        </div>
      </div>
  </Modal_Partial>
}

export default LogsCard