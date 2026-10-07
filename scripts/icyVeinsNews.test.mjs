import assert from 'node:assert/strict'
import test from 'node:test'
import { parseIcyVeinsNews } from './icyVeinsNews.mjs'

test('keeps WoW Forever Icy Veins headlines as linked article metadata', () => {
  const xml = `<rss><channel>
    <item><title><![CDATA[Warrior & Forever]]></title><link>https://www.icy-veins.com/wow-forever/news/warrior/</link><pubDate>Wed, 07 Oct 2026 12:00:00 GMT</pubDate></item>
    <item><title>Retail hotfix</title><link>https://www.icy-veins.com/wow/news/hotfix/</link><pubDate>Wed, 07 Oct 2026 11:00:00 GMT</pubDate></item>
    <item><title>Forever fan post</title><link>https://example.com/article</link><pubDate>Wed, 07 Oct 2026 10:00:00 GMT</pubDate></item>
  </channel></rss>`

  assert.deepEqual(parseIcyVeinsNews(xml), [{
    title: 'Warrior & Forever',
    url: 'https://www.icy-veins.com/wow-forever/news/warrior/',
    publishedAt: 'Wed, 07 Oct 2026 12:00:00 GMT',
  }])
})
