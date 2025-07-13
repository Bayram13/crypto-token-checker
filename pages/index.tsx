import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { getTokenSymbolFromAddress } from '../lib/coingecko'
import { checkCEXMarkets } from '../lib/binance'

export default function Home() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [address, setAddress] = useState('')
  const [token, setToken] = useState<any>(null)
  const [error, setError] = useState('')
  const [markets, setMarkets] = useState<any>(null)

  async function handleSearch() {
    try {
      setError('')
      const info = await getTokenSymbolFromAddress(address)
      setToken(info)

      const marketResults = await checkCEXMarkets(info.symbol)
      setMarkets(marketResults)
    } catch (err: any) {
      setError(err.message)
      setToken(null)
      setMarkets(null)
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
          {token.image && (
            <img src={token.image} alt={token.name} className="h-12" />
          )}
          <h2 className="text-xl font-semibold">{token.name} ({token.symbol})</h2>

          {markets && (
            <div>
              <h3 className="font-bold mt-4">Available on CEXs</h3>
              <ul className="list-disc pl-6">
                {Object.entries(markets).map(([exchange, info]: any, idx) => (
                  <li key={idx}>
                    {exchange}: {info.spot ? (
                      <a href={info.spotLink} target="_blank" className="text-blue-400 underline">Spot</a>
                    ) : 'No Spot'}
                    {info.futures !== undefined && (
                      <>
                        {" | "}
                        {info.futures ? (
                          <a href={info.futuresLink} target="_blank" className="text-blue-400 underline">Futures</a>
                        ) : 'No Futures'}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
