import { createRoot } from "react-dom/client" // Change from 'react-dom'
import { MainGame_C } from "./main-game"

console.log("Start Main Game Client")

const container = document.createElement("react-container")
document.body.appendChild(container)

const root = createRoot(container) // Create root using `createRoot`
root.render(<MainGame_C />) // Use `render` on the root

declare const module: any
if (module.hot) {
  console.log("Hot module replacement active")
}
