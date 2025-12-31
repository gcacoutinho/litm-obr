import React from 'react'
import TextInput from './TextInput'
import ScratchCheckbox from './ScratchCheckbox'

interface ThemeTagInputProps {
  text: string
  isScratched: boolean
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onScratchedChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

/**
 * Renders the theme power tag input field with large styling and scratch checkbox.
 * The theme tag defines the core concept of a theme card.
 */
export const ThemeTagInput: React.FC<ThemeTagInputProps> = ({
  text,
  isScratched,
  onTextChange,
  onScratchedChange,
  placeholder = 'Theme Power Tag',
}) => {
  return (
    <TextInput
      className="power-tag-large"
      value={text}
      onChange={onTextChange}
      placeholder={placeholder}
      trailing={<ScratchCheckbox checked={isScratched} onChange={onScratchedChange} />}
    />
  )
}
