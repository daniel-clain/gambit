// express-middleware.ts
import { exec } from "child_process"
import { Express } from "express"
import path from "path"

export function setupRestartServerEndpoint(expressApp: Express) {
  expressApp.post("/restart-server", (req, res) => {
    exec("pm2 restart gambit", (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(`Error restarting server: ${error?.message || stderr}`)
        return res.status(500).send("Error restarting server")
      }
      console.log(`Server restarted successfully: ${stdout}`)
      res.status(200).send("Server restarted successfully")
    })
  })
}

export function serveFavicon(expressApp: Express) {
  expressApp.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(__dirname, "../../favicon.ico"))
  })
}
