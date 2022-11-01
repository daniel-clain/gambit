
export type Interrupt = {
  promiseFunc: () => Promise<void>
  name?: string
}
