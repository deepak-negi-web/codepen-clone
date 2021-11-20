import { useState, useEffect } from "react";
const PREFIX = "codepen-clone";
export default function useLocalStorage(key, initialValue) {
  const prefixKey = PREFIX + key;
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(prefixKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(prefixKey, JSON.stringify(storedValue));
  }, [prefixKey, storedValue]);

  return [storedValue, setStoredValue];
}
