import { useState, useEffect } from "react";

/**
 * useDebounce
 * @param {any} value - the value you want to debounce
 * @param {number} delay - debounce delay in ms
 * @returns {any} debouncedValue
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // cleanup when value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
