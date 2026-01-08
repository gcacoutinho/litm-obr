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
  const powerTags: PowerTag[] = Array.from({ length: 6 }, (): PowerTag => ({
    text: '',
    isScratched: false
  }))
  const weaknessTags: WeaknessTag[] = Array.from({ length: 2 }, (): WeaknessTag => '')

  return {
    might: 'origin',
    type: '',
    theme: { text: '', isScratched: false },
    powerTags,
    weaknessTags,
    quests: '',
    advancements: {
      abandon: 0,
      improve: 0,
      milestone: 0
    }
  }
}

export function createEmptyFellowshipThemeCard(): FellowshipThemeCardData {
  const powerTags: PowerTag[] = Array.from({ length: 7 }, (): PowerTag => ({
    text: '',
    isScratched: false
  }))
  const weaknessTags: WeaknessTag[] = Array.from({ length: 2 }, (): WeaknessTag => '')

  return {
    theme: { text: '', isScratched: false },
    powerTags,
    weaknessTags,
    quests: '',
    advancements: {
      abandon: 0,
      improve: 0,
      milestone: 0
    }
  }
}

export function createEmptyCharacter(): Character {
  const fellowshipRelationships: Character['fellowshipRelationships'] = Array.from(
    { length: 5 },
    (): Character['fellowshipRelationships'][number] => ({
      companion: '',
      relationshipTag: ''
    })
  )
  const quintessences: string[] = Array.from({ length: 5 }, (): string => '')
  const specialImprovements: string[] = Array.from({ length: 10 }, (): string => '')
  const backpackItems: string[] = Array.from({ length: 10 }, (): string => '')

  return {
    characterName: '',
    playerName: '',
    fellowshipRelationships,
    promises: 0,
    quintessences,
    specialImprovements,
    backpack: {
      items: backpackItems,
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
    obj.every((tag: unknown) => isPowerTag(tag))
  )
}

/**
 * Type guard to validate WeaknessTag array (array of strings)
 */
function isWeaknessTagArray(obj: unknown): obj is WeaknessTag[] {
  return (
    Array.isArray(obj) &&
    obj.every((tag: unknown) => typeof tag === 'string')
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

  const obj: Record<string, unknown> = data as Record<string, unknown>

  const clampNumber = (value: number, max: number): number =>
    Math.min(Math.max(value, 0), max)

  const countTruthy = (value: unknown, max: number): number => {
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
    
    const tc: Record<string, unknown> = themeCard as Record<string, unknown>
    
    // Validate theme, fallback to empty if invalid
    const theme: PowerTag = isPowerTag(tc.theme) ? (tc.theme as PowerTag) : {
      text: '',
      isScratched: false
    }
    
    // Validate powerTags array, fallback to empty if invalid
    const powerTags: PowerTag[] = isPowerTagArray(tc.powerTags) ? (tc.powerTags as PowerTag[]) : []
    
    // Validate weaknessTags array, fallback to empty if invalid
    const weaknessTags: WeaknessTag[] = isWeaknessTagArray(tc.weaknessTags) ? (tc.weaknessTags as WeaknessTag[]) : []
    
    const rawAdvancements: Record<string, unknown> =
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

  const fallbackRelationships: Character['fellowshipRelationships'] = Array.from(
    { length: 5 },
    (): Character['fellowshipRelationships'][number] => ({
      companion: '',
      relationshipTag: ''
    })
  )
  const fellowshipRelationships: Character['fellowshipRelationships'] = Array.isArray(obj.fellowshipRelationships)
    ? (obj.fellowshipRelationships as Character['fellowshipRelationships'])
    : fallbackRelationships
  const fallbackQuintessences: string[] = Array.from({ length: 5 }, (): string => '')
  const quintessences: string[] = Array.isArray(obj.quintessences)
    ? (obj.quintessences as string[])
    : fallbackQuintessences
  const fallbackSpecialImprovements: string[] = Array.from({ length: 10 }, (): string => '')
  const specialImprovements: string[] = Array.isArray(obj.specialImprovements)
    ? (obj.specialImprovements as string[])
    : fallbackSpecialImprovements
  const fallbackBackpackItems: string[] = Array.from({ length: 10 }, (): string => '')
  const fallbackBackpack: Character['backpack'] = {
    items: fallbackBackpackItems,
    notes: ''
  }
  const backpack: Character['backpack'] = isBackpack(obj.backpack) ? obj.backpack : fallbackBackpack

  return {
    characterName: (obj.characterName as string) || '',
    playerName: (obj.playerName as string) || '',
    fellowshipRelationships,
    promises: countTruthy(obj.promises, 5),
    quintessences,
    specialImprovements,
    backpack,
    themeCard1: ensureThemeCardAdvancements(obj.themeCard1),
    themeCard2: ensureThemeCardAdvancements(obj.themeCard2),
    themeCard3: ensureThemeCardAdvancements(obj.themeCard3),
    themeCard4: ensureThemeCardAdvancements(obj.themeCard4)
  }
}
