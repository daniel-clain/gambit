import express, { RequestHandler } from "express"
import { GameHost } from "./source-code/game-host/game-host"

import { exec } from "child_process"
import * as http from "http"
import { Server } from "socket.io"

const PORT = process.env.PORT || 9999
const app = express()
const httpServer = http.createServer(app)

//let webSocketServer = new Server();
const environment = process.env.NODE_ENV

console.log(environment)

let webSocketServer

let gameHost: GameHost

let mainGameRequestHandler: RequestHandler

if (environment == "development") {
  console.log("dev server")
  webSocketServer = new Server(6969)
  mainGameRequestHandler = express.static("host-packages/main-game")
} else {
  console.log("prod server")
  webSocketServer = new Server()
  mainGameRequestHandler = express.static("host-packages/main-game-prod")
}

webSocketServer.listen(httpServer)

gameHost = new GameHost(webSocketServer)

app.post("/restart-server", (req, res) => {
  // Run the script to restart the server (PM2 or any script you prefer)
  exec("pm2 restart gambit", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error restarting server: ${error.message}`)
      return res.status(500).send("Error restarting server")
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`)
      return res.status(500).send("Error restarting server")
    }
    console.log(`stdout: ${stdout}`)
    res.status(200).send("Server restarted successfully")
  })
})

app.use(mainGameRequestHandler)

app.get("/favicon.ico", (req, res) => {
  res.sendFile(`${__dirname}/favicon.ico`)
})
httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`))
console.log(httpServer)
