export async function getTokenSymbolFromAddress(address: string) {
  const chains = ["ethereum", "binance-smart-chain", "arbitrum", "polygon", "avalanche", "base"]

  for (const chain of chains) {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${chain}/contract/${address}`)
    if (res.ok) {
      const data = await res.json()
      return {
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        image: data.image?.large,
      }
    }
  }

  throw new Error("Token not found on supported chains")
}
