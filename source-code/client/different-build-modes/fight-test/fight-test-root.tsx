import { createRoot } from "react-dom/client"
import { FighterTest_C } from "./fight-test"

console.log("Start Fight Test")

const container = document.createElement("react-container")
document.body.appendChild(container)

const root = createRoot(container)
root.render(<FighterTest_C />)

declare const module: any
if (module.hot) {
  console.log("Hot module replacement active")
}
