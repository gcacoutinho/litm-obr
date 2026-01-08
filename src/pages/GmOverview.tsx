import type { ReactElement } from 'react'
import { useMemo } from 'react'
import { useGmCharacterSync } from '../hooks'
import { PlayerRole } from '../hooks/useObrPlayerRole'
import type { GmCharacterPayload } from '../obrd/gmTypes'
import { PowerTag, ThemeCardData } from '../obrd/types'

type GmOverviewProps = {
  role: PlayerRole
}

const placeholder: string = '—'

function displayValue(value: string): string {
  return value.trim() === '' ? placeholder : value
}

function formatPowerTag(tag: PowerTag, index: number): ReactElement | null {
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

function renderThemeCard(card: ThemeCardData): ReactElement {
  const powerTags: ReactElement[] = card.powerTags
    .map((tag: PowerTag, index: number) => formatPowerTag(tag, index))
    .filter((tag): tag is ReactElement => tag !== null)
  const weaknessTags: string[] = card.weaknessTags.filter((tag: string) => tag.trim() !== '')

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
              ? weaknessTags.map((tag: string, index: number) => (
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

export default function GmOverview({ role }: GmOverviewProps): ReactElement {
  const characters: GmCharacterPayload[] = useGmCharacterSync(role)

  const cards = useMemo<ReactElement[]>(() => {
    return characters.map((entry: GmCharacterPayload) => {
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
