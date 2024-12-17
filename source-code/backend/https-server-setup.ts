import { Express } from "express"
import fs from "fs"
import https, { Server } from "https"
import path from "path"

const environment = process.env.NODE_ENV

export function createHttpsServer(expressApp: Express): Server {
  // Setup HTTPS credentials
  const certPath =
    environment === "production"
      ? path.resolve(__dirname, "../../sslcert") // For production
      : path.resolve(__dirname, "../../sslcert") // For development
  const privateKey = fs.readFileSync(path.join(certPath, "server.key"), "utf8")
  const certificate = fs.readFileSync(
    path.join(certPath, "server.cert"),
    "utf8"
  )
  const credentials = { key: privateKey, cert: certificate }
  return https.createServer(credentials, expressApp)
}
