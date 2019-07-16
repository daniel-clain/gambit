
export default interface IGameFacade{  
  betOnFigter(name: string, amount: number)
  getFighterInfo(name: string)
  trainFighter(name: string)
  assaultFighter(name: string)
  protectFighter(name: string)
  assasinateFighter(name: string)
  spyOnFighter(name: string)
  dopeFighter(name: string)
}
