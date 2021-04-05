import * as express from 'express'
import * as env from 'dotenv'
import {GameHost} from './source-code/game-host/game-host';
env.config()

console.log('come on mate...')
let gameHost: GameHost
try{
  gameHost = new GameHost()
}catch(e){
  console.log('error :>> ', e);
}

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('host-packages'));
app.get('/favicon.ico', (req, res) => {
  res.sendFile(`${__dirname}/favicon.ico`)
})
app.get('*', (req, res) => {
  const msg = `connected websocket clients ${gameHost.state.connectedClients.length}`
  console.log('url: ', req.url);
  console.log('msg :>> ', msg);
  res.send(msg)
})
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
