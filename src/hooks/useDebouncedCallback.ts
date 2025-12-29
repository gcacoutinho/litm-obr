import { useRef, useEffect, useMemo } from 'react'

/**
 * Hook that debounces a callback function with a specified delay.
 * Useful for reducing rapid calls (e.g., form input changes).
 *
 * The returned function is memoized to prevent unnecessary re-renders
 * of dependent components.
 *
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns A debounced version of the callback that accepts the same arguments
 *
 * @example
 * const debouncedSave = useDebouncedCallback((value: string) => {
 *   updateCharacter({ notes: value })
 * }, 500)
 *
 * // Call immediately on every keystroke, but updateCharacter fires after 500ms of inactivity
 * <textarea onChange={(e) => debouncedSave(e.target.value)} />
 */
export function useDebouncedCallback<Args extends unknown[], R>(
  callback: (...args: Args) => R,
  delay: number = 500
): (...args: Args) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
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

  // Return memoized debounced function
  return useMemo(() => {
    return (...args: Args): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    }
  }, [delay])
}
