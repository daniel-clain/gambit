import { randomNumber } from "../../../helper-functions/helper-functions"


type Interrupt = {
  name: string
  promiseFunc: () => Promise<void>
}

for(let i = 0; i < 100; i++){
  console.log(randomNumber({to: 1}) == 1 ? 'chicken' : 'wing')
}

export function promTest(){

  randomTakeHit()
  randomDodge()
  decideAction()
}

let mainRej: (interrupt: Interrupt) => void


export function decideAction(){
  console.log('START DECIDE ACTION');

  const action = randomNumber({to: 1}) == 1 ? attack : move

  action()
  .then(() => {
    console.log('FINISH DECIDE ACTION')
    decideAction()
  })
  .catch((reason) => {
    console.log('******* action catch should not be called ',reason);
  })



  function actionPromise(name: string): Promise<void>{
    return new Promise(async (res, rej) => {
      mainRej = rej
      console.log('-- '+name+' start');
      setTimeout(res, 3000)
    })
    .then(() => {    
      console.log('-- '+name+' finished');
    })
    .catch((interrupt: Interrupt) => {    
      console.log('-- '+name+' interrupted by ', interrupt.name);
      throw interrupt
    })
  }



  function attack(){
    console.log('- attack start');
    return (
      randomNumber({to: 1}) == 1 ? Promise.resolve() : Promise.resolve()
      .then(preAttack)
      .then(postAttack)
      .then(attackCooldown)
      .then(() => {
        console.log('- attack finished')
      })
      .catch((interrupt: Interrupt) => {
        return interrupt.promiseFunc()
      })
    )
  }



  

  function move(){
    console.log('- move start');
    return (
      (randomNumber({to: 1}) == 1 ? turnAround() : Promise.resolve())
      .then(moveABit)
      .then(() => {
        console.log('- move finished')
      })
      .catch((interrupt: Interrupt) => {
        return interrupt.promiseFunc()
      })
    )
  }

  function moveABit(){
    return actionPromise('move a bit')
  }

  function turnAround(){
    return actionPromise('turn around')
  }





  function preAttack(){
    return actionPromise('pre attack')
  }
  function postAttack(){
    return actionPromise('post attack')
  }
  function attackCooldown(){
    return actionPromise('attack cooldown')
  }

}


function randomTakeHit(){
  const randomNum = randomNumber({to: 10000})
  setTimeout(() => {
    console.log('randomNumber {to: t}ake hit', randomNum);
    mainRej({
      name: 'xx - take hit',
      promiseFunc: takeHit
    })
    randomTakeHit()
  }, 3000 + randomNum)
}

function randomDodge(){
  const randomNum = randomNumber({to: 10000})
  setTimeout(() => {
    console.log('xx - dodge', randomNum);
    mainRej({
      name: 'dodge',
      promiseFunc: dodge
    })
    randomDodge()
  }, 3000 + randomNum)
}

function takeHit(){
  return new Promise((res, rej) => {
    mainRej = rej
    console.log('xx - take hit start');
    setTimeout(res, 3000)
  })
  .then(() => {    
    console.log('xx - take hit finished');
  })
  .catch((interrupt: Interrupt) => {    
    console.log('xx - take hit interrupted by ', interrupt.name );
    return interrupt.promiseFunc()
  })
}


function dodge(){
  return new Promise((res, rej) => {
    mainRej = rej
    console.log('xx - dodge start');
    setTimeout(res, 3000)
  })
  .then(() => {    
    console.log('xx - dodge finished');
  })
  .catch((interrupt: Interrupt) => {    
    console.log('xx - dodge interrupted by ', interrupt.name );
    return interrupt.promiseFunc()
  })
}


/* 

  learnings
  ============
  - once the first promise is resolved, rejecting it wont affect other promises chained onto it after

  - all promises should have a catch
    - an outer promise should have inner promises throw, which bubble up and are caught by the outer



  questions
  ==============
  * how do i make the inner promises throw from anywhere
    - whenever a promise starts, it overwrites the global promise reject
      - there should never be 2 promises active at once
  * what type of things want to reject the main promise
    - take hit, dodge, block, game over
  * when the main promise is rejected, it is to replace with a new promise. when the main promise finishes, it then decides next action. when the main promise is replaced by a rejection, then we still want to decide action after the rejection
    - should the rejection just insert its promise into the main. or should the main's catch do the next decide action.
      - it should not reject the main, it should just reject the inner parts, and insert its self
        - the main catch should only be for unexpected errors
          xxx - doesnt work, an interrupt still cant be interrupted by a 2nd interrupt


  
  
*/