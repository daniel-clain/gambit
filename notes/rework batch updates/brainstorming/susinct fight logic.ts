fight.start{
  generateFight
  sendFightObjectToClients
  startTheFightTimer
  onFightPaused(() => {
    sendPausedFightObjToClients
    onFightUnpaused(() => {
      sendUnpausedFightObjToClients
    })
  }
  onFightTimerFinished(() => {
    finishFight
  })
}


fightDay.start{
  startF
  if (managerMadeMoney) {
    startLongPostFightTimer
  } else {
    startShortPostFightTimer
  }
}
    

