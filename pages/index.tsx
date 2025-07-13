import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'

export default function Home() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [address, setAddress] = useState('')

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

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder={t('enter_address')}
        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
      />

      <div className="mt-6">
        <p>{t('result_placeholder')}</p>
      </div>
    </div>
  )
}
