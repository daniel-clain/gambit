import x from "../../../client/views/game/manager-view/manager-view-components/cards/fighter-card/fighter-card"
import { Employee } from "../../../interfaces/front-end-state-interface"
import { Evidence, IllegalActivityName } from "../../../types/game/evidence.type"
import { Lawsuit, LawsuitAccount } from "../../../types/game/lawsuit.type"
import { Profession } from "../../../types/game/profession"
import { Game } from "../../game"
import { Manager } from "../../manager"
import { Ability, ClientAbility, ServerAbility, AbilityData } from "../ability"

const sueManager: Ability = {
  name: 'Prosecute Manager',
  cost: { money: 500, actionPoints: 1 },
  possibleSources: ['Lawyer'],
  validTargetIf: ['opponent manager'],
  executes: ['End Of Manager Options Stage'],
  canOnlyTargetSameTargetOnce: true
}

type Verdict = {
  weeksInJail: number
  fine: number
}


export const prosecuteManagerServer: ServerAbility = {
  execute(abilityData: AbilityData, game: Game){
    const {managers} = game.has
    const {source, target} = abilityData
    const prosecutingManager = managers.find(m => m.has.employees.find(e => e.name == source.name))
    const prosecutedManager = managers.find(m => m.has.name == target.name)
    const lawsuit: Lawsuit = createLawsuit()
    addNewsItem()

    const verdict: Verdict = determineTheVerdict()
    console.log('verdict :>> ', verdict);

    const moneyTakenOffPlayer = takeMoneyOffManager()
    giveHalfToProsecutingManager()
    concedeEvidence()
    getPutInJail()
    const lostEmployees: Employee[] = prosecutedManager.has.employees.filter(e => 
      ['Drug Dealer', 'Hitman', 'Thug'].includes(e.profession)  
    )
    lostEmployees.forEach(e => {
      game.functions.resignEmployee(e, prosecutedManager)
    })
    updateManagerLogs()

    //implementation

    function concedeEvidence(){
      const {accounts, prosecutingManager} = lawsuit
      const prosecutingManagerObj = game.has.managers.find(m => m.has.name == prosecutingManager.name)
      prosecutingManagerObj.has.evidence = prosecutingManagerObj.has.evidence.filter(managerEvidence =>  
        !accounts.find(a => a.evidence.find(e => e.id == managerEvidence.id))
      )
      
    }


    function updateManagerLogs(){
      const logMessage = `
        You have been found guilty on accounts of:
        ${lawsuit.accounts.reduce((x, a, i) => 
          x += `\n -${a.name}(${a.evidence.length})`
        , '')}

        . You have been sentenced to ${verdict.weeksInJail} weeks in jail with a fine of $${verdict.fine}. While in jail, you manager has 0 action points.

        ${!lostEmployees.length ? '' : 
          `The following employees have left you: 
            ${lostEmployees.reduce((string, e) => string += `
              \n - ${e.name} (${e.profession})
            `, '')}
          `
        }
      `

      prosecutedManager.functions.addToLog({type: 'critical', message: logMessage})
    }

    function addNewsItem(){
      
      game.has.roundController.preFightNewsStage.newsItems.push({
        newsType: 'manager prosecuted',
        headline: 'Lawsuit filed',
        message: `${prosecutingManager.has.name} has filed a lawsuit against ${prosecutedManager.has.name}`
      })
    }

    function giveHalfToProsecutingManager(){
      prosecutingManager.has.money += moneyTakenOffPlayer / 2
    }

    function takeMoneyOffManager(): number{
      prosecutedManager.has.money -= verdict.fine
      return verdict.fine
    }

    function getPutInJail(){
      prosecutedManager.state.inJail = {
        weeksRemaining: verdict.weeksInJail,
        weeksTotal: verdict.weeksInJail,
        lawsuit
      }
    }

    function createLawsuit(): Lawsuit{
      return {
        prosecutedManager: prosecutedManager.functions.getInfo(), 
        prosecutingManager: prosecutingManager.functions.getInfo(), 
        accounts: abilityData.additionalData.reduce(
          (accounts: LawsuitAccount[], dataItem: {id, evidence: Evidence}): LawsuitAccount[] => {
            if(findAccountWithActivity()){
              findAccountWithActivity().evidence.push(dataItem.evidence)
            }
            else {
              accounts.push({
                name: dataItem.evidence.illegalActivity,
                evidence: [dataItem.evidence]
              })
            }
            return accounts

            function findAccountWithActivity(){
              return accounts.find(account => account.name == dataItem.evidence.illegalActivity)
            }
          }, []
      )}
    }

    function determineTheVerdict(): Verdict{

      const verdict = lawsuit.accounts.reduce((verdict, account): Verdict => {
        console.log(account.name)
        switch(account.name){
          case 'administering performance enhancing drugs': {
            verdict.weeksInJail += account.evidence.length * .3
            verdict.fine += account.evidence.length * 600
          } break
          case 'administering with intent to harm': {
            verdict.weeksInJail += account.evidence.length * 0.4
            verdict.fine += account.evidence.length *600
          } break
          case 'solicitation to commit homicide': {
            verdict.weeksInJail += account.evidence.length * 3
            verdict.fine += account.evidence.length * 7000
          } break
          case 'solicited assault': {
            verdict.weeksInJail += account.evidence.length * .5
            verdict.fine += account.evidence.length * 500
          } break
          case 'supplying illegal substances': {
            verdict.weeksInJail += 1 + account.evidence.length * .6
            verdict.fine += account.evidence.length * 2000
          } break
        }
        return verdict
      }, {weeksInJail: 0, fine: 0} as Verdict)

      return {
        ...verdict,
        weeksInJail: Math.round(verdict.weeksInJail)
      }

    }

  },
  ...sueManager
}

export const prosecuteManagerClient: ClientAbility = {
  shortDescription: 'Prosecute a manager for lots of money',
  longDescription: 'Prosecute an opponent manager for illegal activity, amount sued for is relative to the severity of each account manager is found guilty of. +100 cost for each accusation, 20% chance of success without evidence',
  ...sueManager
}

