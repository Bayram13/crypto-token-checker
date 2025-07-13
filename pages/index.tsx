import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { fetchTokenInfo } from '../lib/coingecko'
import { checkBinanceMarkets } from '../lib/binance'
import { fetchBridgeInfo } from '../lib/defillama'

export default function Home() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [address, setAddress] = useState('')
  const [token, setToken] = useState<any>(null)
  const [error, setError] = useState('')
  const [binance, setBinance] = useState<any>(null)
  const [bridges, setBridges] = useState<string[]>([])

  async function handleSearch() {
    try {
      setError('')
      const data = await fetchTokenInfo(address)
      setToken(data)

      const binanceResult = await checkBinanceMarkets(data.symbol)
      setBinance(binanceResult)

      const bridgeChains = await fetchBridgeInfo(address)
      setBridges(bridgeChains)
    } catch (err: any) {
      setError(err.message)
      setToken(null)
      setBinance(null)
      setBridges([])
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <div className="flex justify-between items-center">
        <div>
          <button onClick={() => i18n.changeLanguage('az')} className="mr-2">AZ</button>
          <button onClick={() => i18n.changeLanguage('ru')} className="mr-2">RU</button>
          <button onClick={() => i18n.changeLanguage('en')}>EN</button>
        </div>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </div>

      <h1 className="text-2xl font-bold my-4">{t('title')}</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t('enter_address')}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {t('search')}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {token && (
        <div className="mt-6 space-y-4 border p-4 rounded dark:border-gray-600">
          <img src={token.image} alt={token.name} className="h-12" />
          <h2 className="text-xl font-semibold">{token.name} ({token.symbol.toUpperCase()})</h2>
          <p><strong>Price:</strong> ${token.market_data.current_price.usd}</p>
          <p><strong>Market Cap:</strong> ${token.market_data.market_cap.usd.toLocaleString()}</p>
          <p><strong>Platforms:</strong> {Object.keys(token.platforms).join(', ')}</p>

          {binance && (
            <div>
              <h3 className="font-bold mt-4">Binance</h3>
              <p>Spot: {binance.spot ? <a href={binance.spotLink} target="_blank" className="text-blue-400 underline">Yes</a> : 'No'}</p>
              <p>Futures: {binance.futures ? <a href={binance.futuresLink} target="_blank" className="text-blue-400 underline">Yes</a> : 'No'}</p>
            </div>
          )}

          {bridges.length > 0 && (
            <div>
              <h3 className="font-bold mt-4">Bridge Chains</h3>
              <ul className="list-disc pl-6">
                {bridges.map((bridge, idx) => (
                  <li key={idx}>{bridge}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
