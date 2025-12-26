import { useState, useEffect } from 'react'
import { translations as t } from './translations'
import HeroCard from './HeroCard'
import Backpack from './Backpack'
import FellowshipThemeCard from './FellowshipThemeCard'
import FellowshipSpecialImprovements from './FellowshipSpecialImprovements'
import ThemeCard1 from './ThemeCard1'
import ThemeCard2 from './ThemeCard2'
import ThemeCard3 from './ThemeCard3'
import ThemeCard4 from './ThemeCard4'
import Configurations from './Configurations'

function App() {
  const [activeTab, setActiveTab] = useState<string>('hero-card')

  const tabs = [
    { id: 'hero-card', label: t['Hero Card'] },
    { id: 'backpack', label: t['Backpack'] },
    { id: 'fellowship-theme-card', label: t['Fellowship Theme Card'] },
    { id: 'fellowship-special-improvements', label: t['Fellowship Special Improvements'] },
    { id: 'theme-card-1', label: t['Theme Card 1'] },
    { id: 'theme-card-2', label: t['Theme Card 2'] },
    { id: 'theme-card-3', label: t['Theme Card 3'] },
    { id: 'theme-card-4', label: t['Theme Card 4'] },
    { id: 'configurations', label: t['⚙️'] }
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
  }, [activeTab])

  const renderContent = () => {
    switch (activeTab) {
      case 'hero-card':
        return <HeroCard />
      case 'backpack':
        return <Backpack />
      case 'fellowship-theme-card':
        return <FellowshipThemeCard />
      case 'fellowship-special-improvements':
        return <FellowshipSpecialImprovements />
      case 'theme-card-1':
        return <ThemeCard1 />
      case 'theme-card-2':
        return <ThemeCard2 />
      case 'theme-card-3':
        return <ThemeCard3 />
      case 'theme-card-4':
        return <ThemeCard4 />
      case 'configurations':
        return <Configurations />
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
      <div className={`tab-content ${activeTab}`}>
        {renderContent()}
      </div>
    </div>
  )
}

export default App