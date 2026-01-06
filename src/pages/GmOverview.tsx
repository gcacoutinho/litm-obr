import { useMemo } from 'react'
import { useGmCharacterSync } from '../hooks'
import { PlayerRole } from '../hooks/useObrPlayerRole'
import { PowerTag, ThemeCardData } from '../obrd/types'

type GmOverviewProps = {
  role: PlayerRole
}

const placeholder = '—'

function displayValue(value: string): string {
  return value.trim() === '' ? placeholder : value
}

function formatPowerTag(tag: PowerTag, index: number) {
  if (tag.text.trim() === '') {
    return null
  }

  return (
    <span
      key={`${index}-${tag.text}`}
      className={`gm-tag ${tag.isScratched ? 'scratched' : ''}`}
    >
      {index + 1}. {displayValue(tag.text)}
    </span>
  )
}

function renderThemeCard(card: ThemeCardData) {
  const powerTags = card.powerTags
    .map((tag, index) => formatPowerTag(tag, index))
    .filter((tag): tag is JSX.Element => tag !== null)
  const weaknessTags = card.weaknessTags.filter((tag) => tag.trim() !== '')

  return (
    <div className="gm-theme-card">
      <div className="gm-theme-details">
        <div className="gm-field">
          <div className="gm-label">Power Tags</div>
          <div className="gm-tags">{powerTags.length > 0 ? powerTags : placeholder}</div>
        </div>
        <div className="gm-field">
          <div className="gm-label">Weakness Tags</div>
          <div className="gm-tags">
            {weaknessTags.length > 0
              ? weaknessTags.map((tag, index) => (
                <span key={`weakness-${index}`} className="gm-tag">
                  {index + 1}. {displayValue(tag)}
                </span>
              ))
              : placeholder}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GmOverview({ role }: GmOverviewProps) {
  const characters = useGmCharacterSync(role)

  const cards = useMemo(() => {
    return characters.map((entry) => {
      const { character } = entry
      return (
        <details key={entry.playerId} className="gm-character-card">
          <summary className="gm-character-summary">
            <div className="gm-character-header">
              <div className="gm-character-name">
                {displayValue(character.characterName)}
              </div>
              <div className="gm-player-meta">
                Player: {displayValue(entry.playerName)} | Updated{' '}
                {new Date(entry.updatedAt).toLocaleString()}
              </div>
            </div>
          </summary>
          <div className="gm-theme-grid">
            {renderThemeCard(character.themeCard1)}
            {renderThemeCard(character.themeCard2)}
            {renderThemeCard(character.themeCard3)}
            {renderThemeCard(character.themeCard4)}
          </div>
        </details>
      )
    })
  }, [characters])

  if (role !== 'GM') {
    return (
      <div className="gm-empty-state">
        GM view is available only for game masters.
      </div>
    )
  }

  if (characters.length === 0) {
    return (
      <div className="gm-empty-state">
        Waiting for player characters...
      </div>
    )
  }

  return <div className="gm-overview-content">{cards}</div>
}
