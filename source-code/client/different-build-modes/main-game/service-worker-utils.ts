export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(new URL("./service-worker.ts", import.meta.url))
      .then((registration) => {
        console.log("Service Worker registered successfully:", registration)
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error)
      })
  }
}
