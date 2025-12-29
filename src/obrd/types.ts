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

/**
 * Type guard to validate PowerTags structure
 */
function isPowerTags(obj: unknown): obj is ThemeCardData['powerTags'] {
  if (!obj || typeof obj !== 'object') return false
  const tags = obj as Record<string, unknown>
  
  return (
    'tag1' in tags && typeof tags.tag1 === 'object' && tags.tag1 !== null &&
    'tag2' in tags && typeof tags.tag2 === 'object' && tags.tag2 !== null &&
    'tag3' in tags && typeof tags.tag3 === 'object' && tags.tag3 !== null &&
    typeof (tags.tag1 as Record<string, unknown>).text === 'string' &&
    typeof (tags.tag1 as Record<string, unknown>).scratched === 'boolean' &&
    typeof (tags.tag2 as Record<string, unknown>).text === 'string' &&
    typeof (tags.tag2 as Record<string, unknown>).scratched === 'boolean' &&
    typeof (tags.tag3 as Record<string, unknown>).text === 'string' &&
    typeof (tags.tag3 as Record<string, unknown>).scratched === 'boolean'
  )
}

/**
 * Type guard to validate Advancements structure
 */
function isAdvancements(obj: unknown): obj is ThemeCardData['advancements'] {
  if (!obj || typeof obj !== 'object') return false
  const adv = obj as Record<string, unknown>
  
  const isProgressArray = (val: unknown): val is [boolean, boolean, boolean] => {
    return (
      Array.isArray(val) && val.length === 3 &&
      val.every(v => typeof v === 'boolean')
    )
  }
  
  return (
    'abandon' in adv && isProgressArray(adv.abandon) &&
    'improve' in adv && isProgressArray(adv.improve) &&
    'milestone' in adv && isProgressArray(adv.milestone)
  )
}

/**
 * Type guard to validate Backpack structure
 */
function isBackpack(obj: unknown): obj is Character['backpack'] {
  if (!obj || typeof obj !== 'object') return false
  const backpack = obj as Record<string, unknown>
  
  return (
    'items' in backpack && Array.isArray(backpack.items) &&
    'notes' in backpack && typeof backpack.notes === 'string'
  )
}

export function migrateCharacter(data: unknown): Character {
  // Ensure data is a character-like object
  if (!data || typeof data !== 'object') {
    return createEmptyCharacter()
  }

  const obj = data as Record<string, unknown>
  
  // Helper to ensure theme card has all required fields
  const ensureThemeCardAdvancements = (themeCard: unknown): ThemeCardData => {
    if (!themeCard || typeof themeCard !== 'object') {
      return createEmptyThemeCard()
    }
    
    const tc = themeCard as Record<string, unknown>
    
    // Validate powerTags, fallback to empty if invalid
    const powerTags = isPowerTags(tc.powerTags) ? tc.powerTags : {
      tag1: { text: '', scratched: false },
      tag2: { text: '', scratched: false },
      tag3: { text: '', scratched: false }
    }
    
    // Validate advancements, fallback to empty if invalid
    const advancements: ThemeCardData['advancements'] = isAdvancements(tc.advancements) ? tc.advancements : {
      abandon: [false, false, false],
      improve: [false, false, false],
      milestone: [false, false, false]
    }
    
    return {
      might: (tc.might as ThemeMight) || 'origin',
      type: (tc.type as string) || '',
      powerTags,
      weaknessTag: (tc.weaknessTag as string) || '',
      quests: (tc.quests as string) || '',
      advancements
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
    backpack: isBackpack(obj.backpack) ? obj.backpack : {
      items: Array(10).fill(''),
      notes: ''
    },
    themeCard1: ensureThemeCardAdvancements(obj.themeCard1),
    themeCard2: ensureThemeCardAdvancements(obj.themeCard2),
    themeCard3: ensureThemeCardAdvancements(obj.themeCard3),
    themeCard4: ensureThemeCardAdvancements(obj.themeCard4)
  }
}
