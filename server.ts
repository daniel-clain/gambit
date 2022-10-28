import express, { RequestHandler } from 'express'
import {GameHost} from './source-code/game-host/game-host';
import fs from 'fs';

import {Server} from 'socket.io';
import * as http from 'http'

import https from 'https';
const privateKey  = fs.readFileSync(`${__dirname}/sslcert/server.key`, 'utf8');
const certificate = fs.readFileSync(`${__dirname}/sslcert/server.cert`, 'utf8');
const credentials = {key: privateKey, cert: certificate};

const PORT = process.env.PORT || 9999;
const app = express();
//const httpServer = https.createServer(credentials, app)
const httpServer = http.createServer(app)



//let webSocketServer = new Server();
const environment = process.env.NODE_ENV

console.log(environment)

let webSocketServer
let mainGameRequestHandler: RequestHandler

if(environment == 'development'){
  console.log('dev server');
  webSocketServer = new Server(6969)
  mainGameRequestHandler = express.static('host-packages/main-game')
} else {
  console.log('prod server');
  webSocketServer = new Server()
  mainGameRequestHandler = express.static('host-packages/main-game-prod')
}

new GameHost(webSocketServer)

webSocketServer.listen(httpServer)


app.use(mainGameRequestHandler);

//app.use('/fight-test', express.static('host-packages/fight-test'));

/* app.get('/', (req, res) => {
  res.write(`
    <a href='main-game'>Main Game</a><br/>
    <a href='fight-test'>Fight Test</a><br/>
  `)
}) */
app.get('/favicon.ico', (req, res) => {
  res.sendFile(`${__dirname}/favicon.ico`)
})
httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));
