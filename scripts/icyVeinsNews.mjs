function decodeXml(text) {
  const cdata = []
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, value) => `__CDATA_${cdata.push(value) - 1}__`)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'")
    .replace(/__CDATA_(\d+)__/g, (_, index) => cdata[Number(index)])
}

function readTag(xml, tag) {
  return decodeXml(xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))?.[1] ?? '').trim()
}

export function parseIcyVeinsNews(xml) {
  return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)]
    .map(([, item]) => {
      const image = readTag(item, 'featured-image')
      return {
        title: readTag(item, 'title'),
        url: readTag(item, 'link'),
        publishedAt: readTag(item, 'pubDate'),
        image: image.startsWith('https://wp.icy-veins.com/') ? image : '',
      }
    })
    .filter((article) => article.url.startsWith('https://www.icy-veins.com/wow-forever/news/'))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 8)
}
