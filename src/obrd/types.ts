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
  advancements: {
    abandon: [boolean, boolean, boolean]
    improve: [boolean, boolean, boolean]
    milestone: [boolean, boolean, boolean]
  }
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
    quests: '',
    advancements: {
      abandon: [false, false, false],
      improve: [false, false, false],
      milestone: [false, false, false]
    }
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

export function migrateCharacter(data: unknown): Character {
  // Ensure data is a character-like object
  if (!data || typeof data !== 'object') {
    return createEmptyCharacter()
  }

  const obj = data as Record<string, unknown>
  
  // Helper to ensure theme card has advancements
  const ensureThemeCardAdvancements = (themeCard: unknown): ThemeCardData => {
    if (!themeCard || typeof themeCard !== 'object') {
      return createEmptyThemeCard()
    }
    
    const tc = themeCard as Record<string, unknown>
    return {
      might: (tc.might as ThemeMight) || 'origin',
      type: (tc.type as string) || '',
      powerTags: tc.powerTags && typeof tc.powerTags === 'object' ? (tc.powerTags as any) : {
        tag1: { text: '', scratched: false },
        tag2: { text: '', scratched: false },
        tag3: { text: '', scratched: false }
      },
      weaknessTag: (tc.weaknessTag as string) || '',
      quests: (tc.quests as string) || '',
      advancements: tc.advancements && typeof tc.advancements === 'object' ? (tc.advancements as any) : {
        abandon: [false, false, false],
        improve: [false, false, false],
        milestone: [false, false, false]
      }
    }
  }

  return {
    characterName: (obj.characterName as string) || '',
    playerName: (obj.playerName as string) || '',
    fellowshipRelationships: Array.isArray(obj.fellowshipRelationships) ? obj.fellowshipRelationships : Array(5).fill(null).map(() => ({
      companion: '',
      relationshipTag: ''
    })),
    promises: Array.isArray(obj.promises) ? obj.promises : Array(5).fill(false),
    quintessences: Array.isArray(obj.quintessences) ? obj.quintessences : Array(5).fill(''),
    backpack: obj.backpack && typeof obj.backpack === 'object' ? (obj.backpack as any) : {
      items: Array(10).fill(''),
      notes: ''
    },
    themeCard1: ensureThemeCardAdvancements(obj.themeCard1),
    themeCard2: ensureThemeCardAdvancements(obj.themeCard2),
    themeCard3: ensureThemeCardAdvancements(obj.themeCard3),
    themeCard4: ensureThemeCardAdvancements(obj.themeCard4)
  }
}
