export async function fetchTokenInfo(address: string) {
  const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`)
  const data = await res.json()

  if (!data.pairs || data.pairs.length === 0) {
    throw new Error('Token not found')
  }

  const token = data.pairs[0].baseToken
  const priceUsd = data.pairs[0].priceUsd

  return {
    name: token.name,
    symbol: token.symbol,
    priceUsd: priceUsd,
    image: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`,
    chains: data.pairs.map((p: any) => p.chainId)
  }
}
