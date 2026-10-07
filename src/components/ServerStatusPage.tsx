import { useEffect, useState } from 'react'

type Check = { status: 'online' | 'offline'; host: string; port: number; latencyMs: number | null }
type Sample = { checkedAt: string; login: Check['status']; realm: Check['status'] }
type Status = { checkedAt: string; login: Check; realm: Check; history: Sample[] }

const API_URL = 'https://raw.githubusercontent.com/doruksayn/FATEFORGE/status-data/status.json'

export function ServerStatusPage() {
  const [data, setData] = useState<Status | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let live = true
    const load = () => fetch(`${API_URL}?t=${Date.now()}`).then((response) => {
      if (!response.ok) throw new Error('Status unavailable')
      return response.json() as Promise<Status>
    }).then((next) => {
      if (live) { setData(next); setError(false) }
    }).catch(() => { if (live) setError(true) })
    void load()
    const timer = window.setInterval(load, 60_000)
    return () => { live = false; window.clearInterval(timer) }
  }, [])

  const online = data?.login.status === 'online' && data.realm.status === 'online'
  const statusLabel = !data ? (error ? 'Data unavailable' : 'Loading status…') : online ? 'All systems operational' : 'Service interruption detected'
  const samples = (data?.history ?? []).slice(-288)
  const upCount = samples.filter((sample) => sample.login === 'online' && sample.realm === 'online').length
  let outages = 0
  let longestOutage = 0
  let currentOutage = 0
  for (const sample of samples) {
    if (sample.login === 'online' && sample.realm === 'online') currentOutage = 0
    else {
      currentOutage++
      if (currentOutage === 1) outages++
      longestOutage = Math.max(longestOutage, currentOutage)
    }
  }

  return (
    <div className="app-shell server-status-shell">
      <div className="name-page-heading">
        <p className="section-kicker">WoW Forever Tools</p>
        <h1>SERVER STATUS</h1>
        <p>Live connection checks for WoW Forever.</p>
      </div>
      <section className="server-status-card" aria-label="WoW Forever server status">
        <div className={`server-status-summary${online ? ' is-online' : ''}`}>
          <span className="server-status-indicator" aria-hidden="true" />
          <div><p className="section-kicker">Current status</p><h2>{statusLabel}</h2></div>
        </div>
        <div className="server-status-services">
          <StatusCheck title="Login Service" check={data?.login} />
          <StatusCheck title="Game Realm" check={data?.realm} />
        </div>
        <div className="server-history-heading">
          <div><p className="section-kicker">Last 24 hours</p><h2>Connection history</h2></div>
          <span>{data ? `Updated ${new Date(data.checkedAt).toLocaleTimeString()}` : 'Updates every 5 minutes'}</span>
        </div>
        <div className="server-status-metrics">
          <div><span>Uptime</span><strong>{samples.length ? `${(upCount / samples.length * 100).toFixed(2)}%` : '—'}</strong></div>
          <div><span>Outages</span><strong>{samples.length ? outages : '—'}</strong></div>
          <div><span>Longest outage</span><strong>{longestOutage ? `${longestOutage * 5} min` : '—'}</strong></div>
        </div>
        <div className="server-history" role="img" aria-label="Connection history over the last 24 hours">
          {samples.map((sample) => {
            const ok = sample.login === 'online' && sample.realm === 'online'
            return <span key={sample.checkedAt} className={ok ? 'history-online' : 'history-offline'} title={`${new Date(sample.checkedAt).toLocaleString()}: ${ok ? 'Online' : 'Connection failed'}`} />
          })}
          {!data?.history.length && <p>{error ? 'Status data has not been published yet.' : 'Waiting for the first check…'}</p>}
        </div>
        <div className="server-status-legend"><span><i className="history-online" />Online</span><span><i className="history-offline" />Connection failed</span></div>
        <p className="server-status-note">Checks whether each server accepts a network connection; this does not verify login or gameplay. Data refreshes every 5 minutes.</p>
      </section>
    </div>
  )
}

function StatusCheck({ title, check }: { title: string; check?: Check }) {
  return <div className="server-status-service">
    <div><span className={`service-dot ${check?.status === 'online' ? 'is-online' : check ? 'is-offline' : ''}`} /><div><h3>{title}</h3><p>{check ? `${check.host}:${check.port}` : 'Awaiting first check'}</p></div></div>
    <strong>{check ? check.status === 'online' ? `Online · ${check.latencyMs} ms` : 'Offline' : 'Pending'}</strong>
  </div>
}
