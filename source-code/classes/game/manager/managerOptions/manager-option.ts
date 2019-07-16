export type ManagerOptionNames = 
'Research fighter' |
'Get fighter sponsored' |
'Train fighter' |
'Send thugs to assault fighter' |
'Send body guards to protect fighter' |
'Assasinate fighter' |
'Send private investigator to spy on manager' |
'Give performance enhancing drugs to fighter' |
'Borrow money from loan shark'
  

export default interface IManagerOption{
  name: ManagerOptionNames
  cost: number
  execute(...args)
}
