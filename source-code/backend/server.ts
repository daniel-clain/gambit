import express from "express"
import http from "http"
import { Server } from "socket.io"
import { serveFavicon, setupRestartServerEndpoint } from "./express-middleware"
import { GameHost } from "./game-host/game-host"
import { createHttpsServer } from "./https-server-setup"

const serverPort = 9999
const environment = process.env.NODE_ENV
console.log("Environment:", environment)

// Create an Express app and HTTPS server
const expressApp = express()

let server

// Serve frontend files based on environment
if (environment === "production") {
  // Endpoint to restart the game server
  const httpsServer = createHttpsServer(expressApp)
  server = httpsServer
  httpsServer.listen(serverPort, () =>
    console.log(`HTTPS server listening on port ${serverPort}`)
  )
  setupRestartServerEndpoint(expressApp)

  // Handle favicon
  serveFavicon(expressApp)
  // Start the servers

  console.log("Serving static files from production build...")
  expressApp.use(express.static("production-builds/main-game"))
} else {
  server = http.createServer()
  server.listen(serverPort, () =>
    console.log(`HTTP server listening on port ${serverPort}`)
  )
  console.log("Development mode: Use Parcel dev server for frontend.")
}

// Initialize WebSocket server
// socket.io default port is 3000
const webSocketServer = new Server(server)

new GameHost(webSocketServer)
