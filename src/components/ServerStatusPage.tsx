import { useEffect, useState } from 'react'

type Check = { status: 'online' | 'offline'; host: string; port: number; latencyMs: number | null }
type Sample = { checkedAt: string; login: Check['status']; realm: Check['status'] }
type NewsArticle = { title: string; url: string; publishedAt: string; image?: string; description?: string }
type Status = { checkedAt: string; login: Check; realm: Check; history: Sample[]; news?: NewsArticle[] }

const API_URL = 'https://raw.githubusercontent.com/doruksayn/FATEFORGE/status-data/status.json'
const ICY_VEINS_NEWS_URL = 'https://www.icy-veins.com/wow-forever/news/'

export function ServerStatusPage() {
  const [data, setData] = useState<Status | null>(null)
  const [error, setError] = useState(false)
  const [now, setNow] = useState(0)

  useEffect(() => {
    let live = true
    const load = () => fetch(`${API_URL}?t=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(10_000) }).then((response) => {
      if (!response.ok) throw new Error('Status unavailable')
      return response.json() as Promise<Status>
    }).then((next) => {
      if (live) { setData(next); setError(false); setNow(Date.now()) }
    }).catch(() => { if (live) setError(true) })
    void load()
    window.addEventListener('focus', load)
    const timer = window.setInterval(() => { setNow(Date.now()); void load() }, 60_000)
    return () => { live = false; window.removeEventListener('focus', load); window.clearInterval(timer) }
  }, [])

  const isStale = data ? !Number.isFinite(Date.parse(data.checkedAt)) || now - Date.parse(data.checkedAt) > 15 * 60_000 : false
  const bothOnline = data?.login.status === 'online' && data.realm.status === 'online'
  const status = !data ? error ? 'unavailable' : 'loading' : isStale ? 'stale' : bothOnline ? 'online' : data.login.status !== data.realm.status ? 'degraded' : 'offline'
  const statusLabel = { unavailable: 'DATA UNAVAILABLE', loading: 'CHECKING…', stale: 'STALE', online: 'ONLINE', degraded: 'DEGRADED', offline: 'OFFLINE' }[status]
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
        <div className={`server-status-summary server-status-summary--${status}`}>
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
            const state = sample.login === 'online' && sample.realm === 'online'
              ? 'online'
              : sample.login === 'offline' && sample.realm === 'offline' ? 'offline' : 'degraded'
            return <span key={sample.checkedAt} className={`history-${state}`} title={`${new Date(sample.checkedAt).toLocaleString()}: ${state}`} />
          })}
          {!data?.history.length && <p>{error ? 'Could not load status data. Retrying…' : 'Waiting for the first check…'}</p>}
        </div>
        <div className="server-status-legend"><span><i className="history-online" />Online</span><span><i className="history-degraded" />Degraded</span><span><i className="history-offline" />Offline</span></div>
        <p className="server-status-note">Checks whether each server accepts a network connection; this does not verify login or gameplay. Data refreshes every 5 minutes.</p>
      </section>
      <section className="official-news-section" aria-labelledby="official-news-heading">
        <div className="official-news-heading">
          <div><p className="section-kicker">Icy Veins · Community news</p><h2 id="official-news-heading">WoW: Forever News</h2></div>
          <a href={ICY_VEINS_NEWS_URL} target="_blank" rel="noopener noreferrer">All News</a>
        </div>
        <div className="official-news-list">
          {(data?.news ?? []).slice(0, 6).map((article) => <a className="official-news-item" href={article.url} key={article.url} target="_blank" rel="noopener noreferrer">
            {article.image && <img src={article.image} alt="" loading="lazy" decoding="async" />}
            <span><time dateTime={article.publishedAt}>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(article.publishedAt))}</time><strong>{article.title}</strong>{article.description && <p>{article.description}</p>}</span>
          </a>)}
          {!data?.news?.length && <p className="official-news-empty">{error ? 'Could not load news. Retrying…' : 'News feed is loading…'}</p>}
        </div>
      </section>
    </div>
  )
}

function StatusCheck({ title, check }: { title: string; check?: Check }) {
  const description = title === 'Login Service' ? 'Battle.net sign-in' : 'WoW Forever game connection'
  return <div className="server-status-service">
    <div><span className={`service-dot ${check?.status === 'online' ? 'is-online' : check ? 'is-offline' : ''}`} /><div><h3>{title}</h3><p>{description}</p></div></div>
    <strong>{check ? check.status === 'online' ? `Online · ${check.latencyMs} ms` : 'Offline' : 'Pending'}</strong>
  </div>
}
