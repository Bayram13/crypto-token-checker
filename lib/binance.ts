export async function checkBinanceMarkets(symbol: string) {
  const res = await fetch('https://api.binance.com/api/v3/exchangeInfo')
  const data = await res.json()
  const symbols = data.symbols.map((s: any) => s.symbol)

  const upper = symbol.toUpperCase()
  const spotExists = symbols.includes(`${upper}USDT`)

  const futuresRes = await fetch('https://fapi.binance.com/fapi/v1/exchangeInfo')
  const futuresData = await futuresRes.json()
  const futuresSymbols = futuresData.symbols.map((s: any) => s.symbol)
  const futuresExists = futuresSymbols.includes(`${upper}USDT`)
