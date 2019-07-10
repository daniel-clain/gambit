import fighterImplementationCode as implementationCode from 'fighter.implementation'

interface FighterStrategy{
  execute(): Promise<void>
}
class Fighter{
  _isFighting: boolean
  isFighting: Observable<boolean> = implementationCode.isFighting

  startFighting(){
    const selectedStrategy = this.determineAndSelectStrategy()
    isStrategy
    selectedStrategy.execute()
    .then({
      onfulfilled: (value) => console.log(value),
      on
    },)


  }


  determineAndSelectStrategy(): FighterStrategy{
    return
  }


}

