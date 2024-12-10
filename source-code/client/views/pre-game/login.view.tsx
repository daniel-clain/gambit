import { observer } from "mobx-react"
import { useState } from "react"
import { setNameAndTryToConnect } from "../../front-end-service/front-end-service"
import { frontEndState } from "../../front-end-state/front-end-state"

export const Login_View = observer(() => {
  const { clientPreGameUIState, isConnectedToWebsocketServer } =
    frontEndState.clientUIState
  let [inputName, setInputName] = useState(clientPreGameUIState.clientName)

  //go()

  return (
    <div className="login-ui">
      {isConnectedToWebsocketServer ? (
        <div className="login-ui__content">
          <div className="login-ui__text">
            You must set your player name before you can connect.
          </div>
          <input
            id="name-input"
            placeholder="name"
            onKeyUp={({ code }) =>
              code == "Enter" && setNameAndTryToConnect(inputName)
            }
            onChange={({ target: { value } }) => setInputName(value)}
            value={inputName || ""}
          />
          <button
            id="submit-name-button"
            onClick={() => {
              setNameAndTryToConnect(inputName)
            }}
          >
            Submit
          </button>

          <hr />

          <div className="login-ui__text">Is this client a game display?</div>
          <button onClick={() => setNameAndTryToConnect("Game Display")}>
            This is a game display
          </button>
        </div>
      ) : (
        <div className="not-connected-to-websockets-message">
          Not connected to websocket server
          <button onClick={handleRestart}>Restart Server</button>
        </div>
      )}
    </div>
  )

  async function handleRestart() {
    try {
      const response = await fetch("http://localhost:9999/restart-server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to restart server")
      }

      const result = await response.json()
      alert("Server restarted successfully")
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }
})
