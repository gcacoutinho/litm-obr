import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import InputCheckbox from './InputCheckbox'

type CheckboxOrientation = 'horizontal' | 'vertical'

interface InputCheckboxGroupProps {
  count: number
  value?: number
  defaultValue?: number
  orientation?: CheckboxOrientation
  disabled?: boolean
  className?: string
  checkboxClassName?: string
  onChange?: (value: number) => void
  getAriaLabel?: (index: number) => string
}

const clampValue = (value: number, max: number): number => {
  if (Number.isNaN(value)) {
    return 0
  }
  return Math.min(Math.max(value, 0), max)
}

const InputCheckboxGroup = ({
  count,
  value,
  defaultValue = 0,
  orientation = 'horizontal',
  disabled = false,
  className,
  checkboxClassName,
  onChange,
  getAriaLabel,
}: InputCheckboxGroupProps): ReactElement => {
  const [internalValue, setInternalValue] = useState<number>(() =>
    clampValue(defaultValue, count)
  )
  const currentValue: number = clampValue(value ?? internalValue, count)

  const checkedStates: boolean[] = useMemo(
    () => Array.from({ length: count }, (_: unknown, index: number) => index < currentValue),
    [count, currentValue],
  )

  const handleCheckboxChange = (index: number, checked: boolean): void => {
    const nextValue: number = checked ? index + 1 : index
    if (value === undefined) {
      setInternalValue(nextValue)
    }
    onChange?.(nextValue)
  }

  const isHorizontal: boolean = orientation === 'horizontal'
  const containerClassName: string = [
    'checkbox-group',
    isHorizontal ? 'checkbox-group-horizontal' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClassName}>
      <div className="checkbox-group-row">
        {checkedStates.map((checked, index) => (
          <InputCheckbox
            key={index}
            className={checkboxClassName || 'checkbox-group-checkbox'}
            checked={checked}
            disabled={disabled}
            onChange={(event) =>
              handleCheckboxChange(index, event.target.checked)
            }
            aria-label={getAriaLabel ? getAriaLabel(index) : undefined}
          />
        ))}
      </div>
    </div>
  )
}

export default InputCheckboxGroup
