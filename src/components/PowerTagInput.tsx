import React from 'react'
import TextInput from './TextInput'
import ScratchCheckbox from './ScratchCheckbox'

type InputChangeHandler = React.ChangeEventHandler<HTMLInputElement>

interface PowerTagInputProps {
  text: string
  isScratched: boolean
  onTextChange: InputChangeHandler
  onScratchedChange: InputChangeHandler
  placeholder?: string
}

/**
 * Renders a single power tag input field with text and scratch checkbox.
 * Used in ThemeCard to manage supporting power tags.
 */
export const PowerTagInput = ({
  text,
  isScratched,
  onTextChange,
  onScratchedChange,
  placeholder = 'Power Tag',
}: PowerTagInputProps): React.ReactElement => {
  return (
    <TextInput
      value={text}
      onChange={onTextChange}
      placeholder={placeholder}
      highlightClassName="power-tag-highlight"
      trailing={<ScratchCheckbox checked={isScratched} onChange={onScratchedChange} />}
    />
  )
}
