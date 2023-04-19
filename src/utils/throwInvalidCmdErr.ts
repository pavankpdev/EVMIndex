import process from 'process'

export const throwInvalidCmdErr = (arg?: string) => {
  if (arg) {
    console.error(`\u001b[1m\u001b[31m${arg}\u001b[0m is not a valid argument`)
  }
  console.error(`Please provide an argument
    \u001b[1m\u001b[35m--index-past-logs\u001b[0m: to index only past logs
    \u001b[1m\u001b[35m--index-live\u001b[0m: to index only live events
    \u001b[1m\u001b[35m--index-all\u001b[0m: to index both past logs and live events
    `)
  process.exit(1)
}
