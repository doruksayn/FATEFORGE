import net from 'node:net'
import { readFile, writeFile } from 'node:fs/promises'
import { parseIcyVeinsNews } from './icyVeinsNews.mjs'

const checks = {
  login: { host: 'test.actual.battle.net', port: 1119 },
  realm: { hosts: ['66.40.176.157', '66.40.178.99', '66.40.179.77'], port: 3724 },
}
const realmStatusUrl = 'https://wowforeverstatus.com/status'
const newsFeed = 'https://wp-prod.icy-veins.com/custom-rss/?category=wow-forever'

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

let previous = null
let history = []
if (previousPath) {
  try {
    previous = JSON.parse(await readFile(previousPath, 'utf8'))
    history = Array.isArray(previous.history) ? previous.history : []
  } catch {}
}

const [login, realmChecks, news] = await Promise.all([
  probe(checks.login),
  Promise.all(checks.realm.hosts.map((host) => probe({ host, port: checks.realm.port }))),
  fetch(newsFeed, { signal: AbortSignal.timeout(10000) })
    .then((response) => response.ok ? response.text() : Promise.reject(new Error('News feed unavailable')))
    .then(parseIcyVeinsNews)
    .catch(() => []),
])
const realm = realmChecks.find((check) => check.status === 'online') ?? realmChecks[0]
// shortcut: probes the three currently published realm IPs; refresh when a complete, reliable host list is available.
// shortcut: trusts a fresh third-party playable-session report when all direct probes fail; replace when Blizzard publishes an official health endpoint.
if (realm.status === 'offline') {
  try {
    const response = await fetch(realmStatusUrl, { signal: AbortSignal.timeout(5000) })
    if (response.ok) {
      const report = await response.json()
      const reportAge = Date.now() - Date.parse(report.checkedAt)
      if (report.status === 'online' && report.statusDetail === 'playable' &&
          report.realmConnection === 'connected' && report.sessionComplete === true &&
          report.dataFreshness === 'fresh' && report.dataAgeSeconds <= 15 * 60 &&
          Number.isFinite(reportAge) && reportAge >= 0 && reportAge <= 15 * 60_000) {
        realm.status = 'online'
        realm.latencyMs = null
      }
    }
  } catch {}
}
const checkedAt = new Date().toISOString()
history = history.filter((sample) => Date.parse(sample.checkedAt) >= Date.now() - 7 * 24 * 60 * 60 * 1000)
history.push({ checkedAt, login: login.status, realm: realm.status })
await writeFile(outputPath, JSON.stringify({ checkedAt, login, realm, history, news: news.length ? news : previous?.news ?? [] }))
