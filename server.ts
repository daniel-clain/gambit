import * as express from 'express'
import * as env from 'dotenv'
import {GameHost} from './source-code/game-host/game-host';
import {Server} from 'socket.io';
import * as http from 'http'
console.log('Server script running... ', process.pid)
env.config()

const PORT = process.env.PORT || 80;
const app = express();
const httpServer = http.createServer(app)

const environment = process.env.NODE_ENV.trim()

let webSocketServer = 
  environment == 'development' ? 
    new Server(6969) :  new Server();

new GameHost(webSocketServer)



if(environment == 'production'){
  webSocketServer.listen(httpServer)
  
  app.use(express.static('host-packages'));

  app.get('/', (req, res) => {
    console.log('test');
    res.write(`
      <h1> Test </h1>
    `)
  })
  app.get('/favicon.ico', (req, res) => {
    res.sendFile(`${__dirname}/favicon.ico`)
  })
  httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));

}