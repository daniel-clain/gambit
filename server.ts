import * as express from 'express'
import * as env from 'dotenv'
import {GameHost} from './source-code/game-host/game-host';
import {Server} from 'socket.io';
import * as http from 'http'

env.config()
const app = express();
const httpServer = http.createServer(app)

const environment = process.env.NODE_ENV.trim()

let webSocketServer = 
  environment == 'development' ? 
    new Server(6969) :  new Server();

new GameHost(webSocketServer)


console.log('come on mate...')

if(environment == 'production'){
  app.use(express.static('host-packages'));
  app.get('/favicon.ico', (req, res) => {
    res.sendFile(`${__dirname}/favicon.ico`)
  })

}
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));