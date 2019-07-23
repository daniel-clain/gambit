
type ClientActionNames = 'Connect' | 'Join Game' | 'Create Game' | 'Cancel Game' | 'Leave Game' | 'Start Game' | 'Ready To Start Game' | 'Submit Global Chat'

export default interface ClientAction{
  name: ClientActionNames
  data?: any
}