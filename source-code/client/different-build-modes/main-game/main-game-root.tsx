import { createRoot } from "react-dom/client"
import { MainGame_C } from "./main-game"

console.log("Start Main Game Client")

const container = document.createElement("react-container")
document.body.appendChild(container)

const root = createRoot(container)
root.render(<MainGame_C />)

declare const module: any
if (module.hot) {
  console.log("Hot module replacement active")
}
