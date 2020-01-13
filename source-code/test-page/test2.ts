let time = 0
setInterval(() => time += 10, 10)
const tl = msg => console.log(`${time} ${msg}`);


let actionInProgress = false
let cancelAction: (reason?) => void


const startAction = (action: {name: string, duration: number, cooldown?: number}) => {

  if(actionInProgress)
    cancelAction(`${action.name} started`)

  return new Promise((resolve, reject) => {
    tl(`starting action ${action.name}`);
    actionInProgress = true
    cancelAction = reject
    setTimeout(() => resolve(), action.duration)
  })
  .then(() => {
    tl(`finished action ${action.name}`);
    actionInProgress = false
    if(action.cooldown)
      return startAction({name: action.name + ' cooldown', duration: action.cooldown})

  })
  .catch(reason => {
    tl(`action ${action.name} was canceled because ${reason}`);
    actionInProgress = false
    throw(reason)

  })
}



const tester = async () => {
  let interupted

  await startAction({name: 'test1', duration: 5000, cooldown: 5000})
  .catch(() => interupted = true)

  if(interupted)
    tl('test1 was interupted')
  else
    tl('test1 was not interupted');
}

const interupter = async () => {
  await startAction({name: 'interupter', duration: 5000})
  tl('interupter finished');
}


tester()
setTimeout(interupter, 7000)
