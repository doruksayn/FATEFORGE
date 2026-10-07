import net from 'node:net'
import { readFile, writeFile } from 'node:fs/promises'

const checks = {
  login: { host: 'test.actual.battle.net', port: 1119 },
  realm: { host: '66.40.176.157', port: 3724 },
}

function probe({ host, port }) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port })
    const startedAt = performance.now()
    const finish = (online) => {
      clearTimeout(timeout)
      socket.destroy()
      resolve({ host, port, status: online ? 'online' : 'offline', latencyMs: online ? Math.round(performance.now() - startedAt) : null })
    }
    const timeout = setTimeout(() => finish(false), 5000)
    socket.once('connect', () => finish(true))
    socket.once('error', () => finish(false))
  })
}

const [previousPath, outputPath] = process.argv.slice(2)
if (!outputPath) throw new Error('Usage: node scripts/check-server-status.mjs [previous.json] output.json')

let history = []
if (previousPath) {
  try {
    const previous = JSON.parse(await readFile(previousPath, 'utf8'))
    history = Array.isArray(previous.history) ? previous.history : []
  } catch {}
}

const [login, realm] = await Promise.all([probe(checks.login), probe(checks.realm)])
const checkedAt = new Date().toISOString()
history = history.filter((sample) => Date.parse(sample.checkedAt) >= Date.now() - 7 * 24 * 60 * 60 * 1000)
history.push({ checkedAt, login: login.status, realm: realm.status })
await writeFile(outputPath, JSON.stringify({ checkedAt, login, realm, history }))
