export type ThemeMight = 'origin' | 'adventure' | 'greatness'

export interface ThemeCardData {
  might: ThemeMight
  type: string
  powerTags: {
    tag1: { text: string; scratched: boolean }
    tag2: { text: string; scratched: boolean }
    tag3: { text: string; scratched: boolean }
  }
  weaknessTag: string
  quests: string
}

export interface Character {
  // Hero Card
  characterName: string
  playerName: string
  fellowshipRelationships: Array<{
    companion: string
    relationshipTag: string
  }> // Length: 5
  promises: boolean[] // Length: 5
  quintessences: string[] // Length: 5
  
  // Backpack
  backpack: {
    items: string[] // Length: 10
    notes: string
  }
  
  // Theme Cards (separate data for each)
  themeCard1: ThemeCardData
  themeCard2: ThemeCardData
  themeCard3: ThemeCardData
  themeCard4: ThemeCardData
}

export function createEmptyThemeCard(): ThemeCardData {
  return {
    might: 'origin',
    type: '',
    powerTags: {
      tag1: { text: '', scratched: false },
      tag2: { text: '', scratched: false },
      tag3: { text: '', scratched: false }
    },
    weaknessTag: '',
    quests: ''
  }
}

export function createEmptyCharacter(): Character {
  return {
    characterName: '',
    playerName: '',
    fellowshipRelationships: Array(5).fill(null).map(() => ({
      companion: '',
      relationshipTag: ''
    })),
    promises: Array(5).fill(false),
    quintessences: Array(5).fill(''),
    backpack: {
      items: Array(10).fill(''),
      notes: ''
    },
    themeCard1: createEmptyThemeCard(),
    themeCard2: createEmptyThemeCard(),
    themeCard3: createEmptyThemeCard(),
    themeCard4: createEmptyThemeCard()
  }
}
