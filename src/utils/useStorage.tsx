//https://github.com/collegewap/next-local-storage/blob/main/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [state, setState] = useState<T>(() => {
    // Initialize the state
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const value = window.localStorage.getItem(key);
      // Check if the local storage already has any values,
      // otherwise initialize it with the passed initialValue
      return value ? JSON.parse(value) : initialValue;
    } catch (error) {
      console.log(error);
    }
  });

  const setValue = (value: T) => {
    try {
      // If the passed value is a callback function,
      //  then call it with the existing state.
      const valueToStore = value instanceof Function ? value(state) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      window.dispatchEvent(new Event('local-storage'));
      setState(value);
    } catch (error) {
      console.log(error);
    }
  };

  // Listen to changes in local storage
  useEffect(() => {
    const handleStorage = () => {
      const value = window.localStorage.getItem(key);
      if (value) {
        setState(JSON.parse(value));
      }
    };
    window.addEventListener('local-storage', handleStorage);
    return () => window.removeEventListener('local-storage', handleStorage);
  }, []);

  return [state, setValue] as const;
};

export default useLocalStorage;
