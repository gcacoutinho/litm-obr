export type ThemeMight = 'origin' | 'adventure' | 'greatness'

export type PowerTag = {
  text: string
  isScratched: boolean
}

export type WeaknessTag = string

export interface ThemeCardData {
  might: ThemeMight
  type: string
  theme: PowerTag
  powerTags: PowerTag[]
  weaknessTags: WeaknessTag[]
  quests: string
  advancements: {
    abandon: number
    improve: number
    milestone: number
  }
}

export interface FellowshipThemeCardData {
  theme: PowerTag
  powerTags: PowerTag[]
  weaknessTags: WeaknessTag[]
  quests: string
  advancements: {
    abandon: number
    improve: number
    milestone: number
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
  promises: number // 0-5
   quintessences: string[] // Length: 5
   specialImprovements: string[] // Length: 10

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
    theme: { text: '', isScratched: false },
    powerTags: Array(6).fill(null).map(() => ({
      text: '',
      isScratched: false
    })),
    weaknessTags: ['', ''],
    quests: '',
    advancements: {
      abandon: 0,
      improve: 0,
      milestone: 0
    }
  }
}

export function createEmptyFellowshipThemeCard(): FellowshipThemeCardData {
  return {
    theme: { text: '', isScratched: false },
    powerTags: Array(7).fill(null).map(() => ({
      text: '',
      isScratched: false
    })),
    weaknessTags: ['', ''],
    quests: '',
    advancements: {
      abandon: 0,
      improve: 0,
      milestone: 0
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
    promises: 0,
    quintessences: Array(5).fill(''),
    specialImprovements: Array(10).fill(''),
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
 * Type guard to validate a single PowerTag
 */
function isPowerTag(obj: unknown): obj is PowerTag {
  if (!obj || typeof obj !== 'object') return false
  const tag = obj as Record<string, unknown>
  return (
    typeof tag.text === 'string' &&
    typeof tag.isScratched === 'boolean'
  )
}

/**
 * Type guard to validate PowerTag array
 */
function isPowerTagArray(obj: unknown): obj is PowerTag[] {
  return (
    Array.isArray(obj) &&
    obj.every(tag => isPowerTag(tag))
  )
}

/**
 * Type guard to validate WeaknessTag array (array of strings)
 */
function isWeaknessTagArray(obj: unknown): obj is WeaknessTag[] {
  return (
    Array.isArray(obj) &&
    obj.every(tag => typeof tag === 'string')
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

  const clampNumber = (value: number, max: number) =>
    Math.min(Math.max(value, 0), max)

  const countTruthy = (value: unknown, max: number) => {
    if (Array.isArray(value)) {
      return clampNumber(value.filter(Boolean).length, max)
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return clampNumber(value, max)
    }
    return 0
  }
  
  // Helper to ensure theme card has all required fields
  const ensureThemeCardAdvancements = (themeCard: unknown): ThemeCardData => {
    if (!themeCard || typeof themeCard !== 'object') {
      return createEmptyThemeCard()
    }
    
    const tc = themeCard as Record<string, unknown>
    
    // Validate theme, fallback to empty if invalid
    const theme: PowerTag = isPowerTag(tc.theme) ? (tc.theme as PowerTag) : {
      text: '',
      isScratched: false
    }
    
    // Validate powerTags array, fallback to empty if invalid
    const powerTags: PowerTag[] = isPowerTagArray(tc.powerTags) ? (tc.powerTags as PowerTag[]) : []
    
    // Validate weaknessTags array, fallback to empty if invalid
    const weaknessTags: WeaknessTag[] = isWeaknessTagArray(tc.weaknessTags) ? (tc.weaknessTags as WeaknessTag[]) : []
    
    const rawAdvancements =
      tc.advancements && typeof tc.advancements === 'object'
        ? (tc.advancements as Record<string, unknown>)
        : {}
    const advancements: ThemeCardData['advancements'] = {
      abandon: countTruthy(rawAdvancements.abandon, 3),
      improve: countTruthy(rawAdvancements.improve, 3),
      milestone: countTruthy(rawAdvancements.milestone, 3)
    }
    
    return {
      might: (tc.might as ThemeMight) || 'origin',
      type: (tc.type as string) || '',
      theme,
      powerTags,
      weaknessTags,
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
    promises: countTruthy(obj.promises, 5),
    quintessences: Array.isArray(obj.quintessences) ? obj.quintessences : Array(5).fill(''),
    specialImprovements: Array.isArray(obj.specialImprovements) ? obj.specialImprovements : Array(10).fill(''),
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
