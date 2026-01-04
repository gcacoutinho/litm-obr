import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './App.css'
import { useCharacterStorage } from './hooks'
import HeroCard from './pages/HeroCard'
import Backpack from './pages/Backpack'
import FellowshipThemeCard from './pages/FellowshipThemeCard'
import FellowshipSpecialImprovements from './pages/FellowshipSpecialImprovements'
import ThemeCard from './pages/ThemeCard'
import Configurations from './pages/Configurations'

/**
 * Main application component with tabbed interface for character management.
 * Manages navigation between hero card, backpack, theme cards, and other sections.
 * Includes language selection and persistence.
 */
function App() {
  const { t } = useTranslation()
  const { character, isLoading, updateCharacter, clearCharacter } = useCharacterStorage()
  const [activeTab, setActiveTab] = useState<string>('hero-card')
  const tabContentRef = useRef<HTMLDivElement>(null)

  const tabs = [
    { id: 'hero-card', label: t('tab.heroCard') },
    { id: 'backpack', label: t('tab.backpack') },
    { id: 'fellowship-theme-card', label: t('tab.fellowshipThemeCard') },
    { id: 'fellowship-special-improvements', label: t('tab.fellowshipSpecialImprovements') },
    { id: 'theme-card-1', label: t('tab.themeCard1') },
    { id: 'theme-card-2', label: t('tab.themeCard2') },
    { id: 'theme-card-3', label: t('tab.themeCard3') },
    { id: 'theme-card-4', label: t('tab.themeCard4') },
    { id: 'configurations', label: t('tab.configurations') }
  ]

  const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
  const isFirstTab = currentIndex === 0
  const isLastTab = currentIndex === tabs.length - 1

  const goToPrevious = () => {
    if (!isFirstTab) {
      setActiveTab(tabs[currentIndex - 1].id)
    }
  }

  const goToNext = () => {
    if (!isLastTab) {
      setActiveTab(tabs[currentIndex + 1].id)
    }
  }

  const scrollToSelectedTab = () => {
    const selectedTab = document.querySelector('.tab.active') as HTMLElement | null;
    if (selectedTab) {
      selectedTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }

  useEffect(() => {
    scrollToSelectedTab();
    // Reset tab-content scroll to top
    if (tabContentRef.current) {
      tabContentRef.current.scrollTop = 0;
    }
  }, [activeTab])

  const renderContent = () => {
    if (isLoading || !character) {
      return <div className="app-loading">{t('app.loading')}</div>
    }

    switch (activeTab) {
      case 'hero-card':
        return <HeroCard character={character} onUpdate={updateCharacter} />
      case 'backpack':
        return <Backpack character={character} onUpdate={updateCharacter} />
      case 'fellowship-theme-card':
        return <FellowshipThemeCard />
      case 'fellowship-special-improvements':
        return <FellowshipSpecialImprovements />
      case 'theme-card-1':
        return <ThemeCard cardNumber={1} character={character} onUpdate={updateCharacter} />
      case 'theme-card-2':
        return <ThemeCard cardNumber={2} character={character} onUpdate={updateCharacter} />
      case 'theme-card-3':
        return <ThemeCard cardNumber={3} character={character} onUpdate={updateCharacter} />
      case 'theme-card-4':
        return <ThemeCard cardNumber={4} character={character} onUpdate={updateCharacter} />
      case 'configurations':
        return <Configurations onClearCharacter={clearCharacter} />
      default:
        return null
    }
  }

  return (
    <div className="card">
      <div className="tab-bar">
        <button
          className="scroll-nav-arrow left"
          onClick={goToPrevious}
          disabled={isFirstTab}
          aria-label="Previous tab"
        >
          ◀
        </button>
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          className="scroll-nav-arrow right"
          onClick={goToNext}
          disabled={isLastTab}
          aria-label="Next tab"
        >
          ▶
        </button>
      </div>
      <div ref={tabContentRef} className={`tab-content ${activeTab}`}>
        {renderContent()}
      </div>
    </div>
  )
}

export default App
