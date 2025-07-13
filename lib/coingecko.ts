export async function fetchTokenInfo(address: string) {
  const url = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Token not found')
  const data = await res.json()

  return {
    name: data.name,
    symbol: data.symbol,
    image: data.image.large,
    market_data: data.market_data,
    links: data.links,
    id: data.id,
    platforms: data.platforms
  }
}
