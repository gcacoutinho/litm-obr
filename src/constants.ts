/**
 * UI String Constants
 *
 * NOTE: These are hardcoded English strings for MVP.
 * When implementing localization (i18n), these should be moved to a proper i18n system
 * and this file should be replaced with locale-based string loading.
 */

// Tab labels
export const TAB_LABELS = {
  HERO_CARD: 'Hero Card',
  BACKPACK: 'Backpack',
  FELLOWSHIP_THEME_CARD: 'Fellowship Theme Card',
  FELLOWSHIP_SPECIAL_IMPROVEMENTS: 'Fellowship Special Improvements',
  THEME_CARD_1: 'Theme Card 1',
  THEME_CARD_2: 'Theme Card 2',
  THEME_CARD_3: 'Theme Card 3',
  THEME_CARD_4: 'Theme Card 4',
  CONFIGURATIONS: '⚙️',
} as const

// Hero Card
export const HERO_CARD_LABELS = {
  CHARACTER_NAME: 'Character Name',
  PLAYER_NAME: 'Player Name',
  ENTER_PLAYER_NAME: 'Enter player name',
  FELLOWSHIP_RELATIONSHIP: 'FELLOWSHIP RELATIONSHIP',
  COMPANION: 'Companion',
  RELATIONSHIP_TAG: 'Relationship Tag',
  PROMISE: 'Promise',
  QUINTESSENCES: 'Quintessences',
} as const

// Relationship placeholders
export const COMPANION_PLACEHOLDERS = [
  'Companion 1',
  'Companion 2',
  'Companion 3',
  'Companion 4',
  'Companion 5',
] as const

export const TAG_PLACEHOLDERS = [
  'Tag 1',
  'Tag 2',
  'Tag 3',
  'Tag 4',
  'Tag 5',
] as const

export const QUINTESSENCE_PLACEHOLDERS = [
  'Quintessence 1',
  'Quintessence 2',
  'Quintessence 3',
  'Quintessence 4',
  'Quintessence 5',
] as const

// Backpack
export const BACKPACK_LABELS = {
  BACKPACK: 'Backpack',
  NOTES: 'Notes',
} as const

export const ITEM_PLACEHOLDERS = [
  'Item 1',
  'Item 2',
  'Item 3',
  'Item 4',
  'Item 5',
  'Item 6',
  'Item 7',
  'Item 8',
  'Item 9',
  'Item 10',
] as const

// Theme Card might options
export const MIGHT_OPTIONS = {
  ORIGIN: 'Origin',
  ADVENTURE: 'Adventure',
  GREATNESS: 'Greatness',
} as const
