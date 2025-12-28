import { useRef, useEffect } from 'react'

/**
 * Hook that debounces a callback function with a specified delay.
 * Useful for reducing rapid calls (e.g., form input changes).
 * 
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns A debounced version of the callback
 * 
 * @example
 * const debouncedSave = useDebouncedCallback((value) => {
 *   updateCharacter({ notes: value })
 * }, 500)
 * 
 * // Call immediately on every keystroke, but updateCharacter fires after 500ms of inactivity
 * <textarea onChange={(e) => debouncedSave(e.target.value)} />
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const timeoutRef = useRef<number | undefined>(undefined)
  const callbackRef = useRef(callback)

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Return debounced function
  const debounced = ((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = window.setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }) as T

  return debounced
}
