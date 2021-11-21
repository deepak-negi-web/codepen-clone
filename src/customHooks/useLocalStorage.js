import { useState, useEffect } from "react";
import { isClient } from "../utils";
const PREFIX = "codepen-clone";
export default function useLocalStorage(key, initialValue) {
  const prefixKey = PREFIX + key;
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = isClient ? window.localStorage.getItem(prefixKey) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (isClient) {
      window.localStorage.setItem(prefixKey, JSON.stringify(storedValue));
    }
  }, [prefixKey, storedValue]);

  return [storedValue, setStoredValue];
}
