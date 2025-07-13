export async function checkCEXMarkets(symbol: string) {
  const exchanges = {
    Binance: `https://api.binance.com/api/v3/exchangeInfo`,
    MEXC: `https://api.mexc.com/api/v3/exchangeInfo`,
    Bitget: `https://api.bitget.com/api/spot/v1/public/products`,
    Bybit: `https://api.bybit.com/spot/v1/symbols`,
    BingX: `https://bingx.com/`, // No API, placeholder link
    Weex: `https://weex.com/`, // No API, placeholder link
    OKX: `https://www.okx.com/api/v5/market/tickers?instType=SPOT`
  }

  const results: any = {}
  const upper = symbol.toUpperCase()

  // Binance Spot + Futures
  const binanceRes = await fetch(exchanges.Binance)
  const binanceData = await binanceRes.json()
  const binanceSymbols = binanceData.symbols.map((s: any) => s.symbol)
  results.Binance = {
    spot: binanceSymbols.includes(`${upper}USDT`),
    futures: false,
    spotLink: `https://www.binance.com/en/trade/${upper}_USDT`,
    futuresLink: `https://www.binance.com/en/futures/${upper}USDT`
  }
  const futuresRes = await fetch('https://fapi.binance.com/fapi/v1/exchangeInfo')
  const futuresData = await futuresRes.json()
  const futuresSymbols = futuresData.symbols.map((s: any) => s.symbol)
  results.Binance.futures = futuresSymbols.includes(`${upper}USDT`)

  // MEXC
  const mexcRes = await fetch(exchanges.MEXC)
  const mexcData = await mexcRes.json()
  results.MEXC = {
    spot: mexcData.symbols?.some((s: any) => s.symbol === `${upper}_USDT`),
    spotLink: `https://www.mexc.com/exchange/${upper}_USDT`
  }

  // Bitget
  const bitgetRes = await fetch(exchanges.Bitget)
  const bitgetData = await bitgetRes.json()
  results.Bitget = {
    spot: bitgetData.data?.some((p: any) => p.symbol === `${upper}USDT`),
    spotLink: `https://www.bitget.com/en/spot/${upper}USDT`
  }

  // Bybit
  const bybitRes = await fetch(exchanges.Bybit)
  const bybitData = await bybitRes.json()
  results.Bybit = {
    spot: bybitData.result?.some((s: any) => s.name === `${upper}/USDT`),
    spotLink: `https://www.bybit.com/en/trade/spot/${upper}/USDT`
  }

  // BingX (link only)
  results.BingX = {
    spot: true,
    spotLink: `https://bingx.com/en-us/spot/${upper}-USDT`
  }

  // Weex (link only)
  results.Weex = {
    spot: true,
    spotLink: `https://www.weex.com/en-us/spot/${upper}_USDT`
  }

  // OKX
  const okxRes = await fetch(exchanges.OKX)
  const okxData = await okxRes.json()
  results.OKX = {
    spot: okxData.data?.some((s: any) => s.instId === `${upper}-USDT`),
    spotLink: `https://www.okx.com/trade-spot/${upper}-usdt`
  }

  return results
}
