const API_KEY = 'e224aab0-7f6f-4ccb-8a41-ee9da6778752';

export async function fetchTokenFromCMC(contractAddress: string): Promise<any> {
  const res = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?address=${contractAddress}`, {
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY,
    },
  })

  if (!res.ok) throw new Error('Token not found')

  const json = await res.json()
  const data = Object.values(json.data)[0] as any

  return {
    id: data.id,
    name: data.name,
    symbol: data.symbol,
    image: data.logo,
    platforms: data.platform ? Object.keys(data.platform) : []
  }
}

export async function fetchMarketPairsFromCMC(id: number) {
  const res = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/market-pairs/latest?id=${id}`, {
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY,
    },
  })

  if (!res.ok) throw new Error('Market data not found')

  const json = await res.json()
  const spot: string[] = []
  const futures: string[] = []

  json.data.market_pairs.forEach((pair: any) => {
    const exchange = pair.exchange_name
    const type = pair.market_type
    if (type === 'spot' && !spot.includes(exchange)) spot.push(exchange)
    if (type === 'futures' && !futures.includes(exchange)) futures.push(exchange)
  })

  return { spot, futures }
}
