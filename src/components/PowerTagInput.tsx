import React from 'react'
import TextInput from './TextInput'
import ScratchCheckbox from './ScratchCheckbox'

interface PowerTagInputProps {
  tagNumber: 1 | 2 | 3
  text: string
  scratched: boolean
  onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onScratchedChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Renders a single power tag input field with text and scratch checkbox.
 * Used in ThemeCard to manage power tags.
 */
export const PowerTagInput: React.FC<PowerTagInputProps> = ({
  tagNumber,
  text,
  scratched,
  onTextChange,
  onScratchedChange,
}) => {
  return (
    <TextInput
      className={tagNumber === 1 ? 'power-tag-large' : ''}
      value={text}
      onChange={onTextChange}
      placeholder={`Power Tag ${tagNumber}`}
      trailing={<ScratchCheckbox checked={scratched} onChange={onScratchedChange} />}
    />
  )
}
