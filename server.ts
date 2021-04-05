import * as express from 'express'
import * as env from 'dotenv'
import {GameHost} from './source-code/game-host/game-host';
import {Server} from 'socket.io';
import * as http from 'http'

env.config()
const app = express();
const httpServer = http.createServer(app)

const webSocketServer = new Server(httpServer);
new GameHost(webSocketServer)


console.log('come on mate...')


const PORT = process.env.PORT || 3000;
app.use(express.static('host-packages'));
app.get('/favicon.ico', (req, res) => {
  res.sendFile(`${__dirname}/favicon.ico`)
})

httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));
