export async function fetchBridgeInfo(address: string) {
  const res = await fetch(`https://coins.llama.fi/prices/current/ethereum:${address}`)
  const data = await res.json()
  return data.coins ? Object.keys(data.coins) : []
}
