import { Subject } from "rxjs";

const pauseButton = document.querySelector('button')
const countdownElem = document.querySelector('countdown')
var paused = false
const unpauseSubject = new Subject()


pauseButton.onclick = e => paused ? unpause() : pause()



function pause(){
  paused = true
  pauseButton.innerText = 'Un-Pause'
}

function unpause(){
  paused = false
  unpauseSubject.next()
  pauseButton.innerText = 'Pause'
}

function waitForUnpause(): Promise<void>{
  return new Promise(resolve => {
    const subscription = unpauseSubject.subscribe(() => {
      subscription.unsubscribe()
      resolve()
    })
  });
}

function pausableTimer(seconds): Promise<void>{
  return new Promise(timerFinished => {
    let countDown = seconds * 100
    wait1Second()

    async function wait1Second(){
      countdownElem.innerHTML = (countDown/100).toString()
      if(countDown == 0)
        timerFinished() 
      else{
        if(paused)
          await waitForUnpause()
        await new Promise(resolve => setTimeout(resolve, 10));
        --countDown
        wait1Second()
      }
    }
  });
}





async function go(){
  console.log('doing go');
  setTimeout(pause, 2000);
  setTimeout(unpause, 4000);
  await pausableTimer(4)
  console.log('4 sec timer finished');
}

go()