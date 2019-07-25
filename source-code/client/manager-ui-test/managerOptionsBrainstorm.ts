const managerOptions = [
  {
    name: 'Discover Fighter',
    ui: 'window on main ui with discover fighter button, shows ap & m cost, shows brief description, also shows discoveredFighters: num with button that says seed discovered fighters, popup shows with scroll of fighters names, on select fighter, fighter info comes up, shows days since last update, shows basic info eg wins, strenght, speed, ',
    cost: '1ap, 10m. if you have employed a talent scout, cost is 0ap 0m',
    effect: 'picks a random fighter out of the full fighter list, if the fighter has not yet been discovered, fighter is added to discovered fighter list. 10% chance to run a 2nd time. If you have employed a talent scout, 80% chance to run one more time, and 30% chance to run one more time. up to 3 times',
    note: 'if fighter is in next fight, he is automatically discovered'
  },
  {
    name: ''
  }
]


const managerUi = {
  topBarStats: ['money', 'action points', ],
  expandingTiles: [
    {
      name: 'Next Fight',
      smallUi: 'fighter names with pictures',
      expandedUi: 'larger fighter cards, showing updated basic fighter info, button to bet, popup to chose large medium or small bet, after selection, shows figher card highlighted with bet info. bet can be changed. fighter card also has investigate action, cost is lower if you have private investigator employee, investigate returns advanced info, aggression, inteligence, owning manager. another button for options. options include send thugs to attack, send assasin to poison, send assasin to assasinate, send hecklers, '
      
    },
    {
      name: 'Known Fighters'
    },
    {
      name: 'Client Fighters',
      smallUi: 'fighter names with pictures',
      expandedUi: 'larger fighter cards, showing all fighter info. info like .option to train, guard, promote, try to get into upcoming fight, decide fight tactics, '
    },
    {
      name: 'Employed Staff'
    }
  }


]