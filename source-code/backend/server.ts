import express from "express"
import { Server } from "socket.io"
import { serveFavicon, setupRestartServerEndpoint } from "./express-middleware"
import { GameHost } from "./game-host/game-host"
import { createHttpsServer } from "./https-server-setup"

const serverPort = 9999
const environment = process.env.NODE_ENV
console.log("Environment:", environment)

// Create an Express app and HTTPS server
const expressApp = express()
const httpsServer = createHttpsServer(expressApp)

httpsServer.listen(serverPort, () =>
  console.log(`HTTPS server listening on port ${serverPort}`)
)

// Serve frontend files based on environment
if (environment === "production") {
  // Endpoint to restart the game server
  setupRestartServerEndpoint(expressApp)

  // Handle favicon
  serveFavicon(expressApp)
  // Start the servers

  console.log("Serving static files from production build...")
  expressApp.use(express.static("host-packages/main-game-prod"))
} else {
  console.log("Development mode: Use Parcel dev server for frontend.")
}

// Initialize WebSocket server
// socket.io default port is 3000
const webSocketServer = new Server(httpsServer)

new GameHost(webSocketServer)
