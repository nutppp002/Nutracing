import { useState, useEffect, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMounted = useRef(true);

  // Initialize and load data from the API
  useEffect(() => {
    isMounted.current = true;
    
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/data/${key}`);
        if (response.ok) {
          const data = await response.json();
          if (data.value !== undefined) {
            if (isMounted.current) {
              setStoredValue(data.value);
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching ${key} from server:`, error);
      } finally {
        if (isMounted.current) {
          setIsLoaded(true);
        }
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, [key]);

  const setValue = async (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update local state immediately for fast UI response
      setStoredValue(valueToStore);
      
      // Save to server
      const response = await fetch(`/api/data/${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: valueToStore })
      });
      
      if (!response.ok) {
        console.error(`Failed to save ${key} to server`);
      }
    } catch (error) {
      console.warn(`Error setting key "${key}":`, error);
    }
  };

  // Polling to sync state across different machines
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/data/${key}`);
        if (response.ok) {
          const data = await response.json();
          if (data.value !== undefined) {
            if (isMounted.current) {
              setStoredValue(prev => {
                // Only update if changed to avoid unnecessary re-renders
                if (JSON.stringify(prev) !== JSON.stringify(data.value)) {
                  return data.value;
                }
                return prev;
              });
            }
          }
        }
      } catch (error) {
        // Ignore polling errors to prevent console spam
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [key]);

  return [storedValue, setValue, isLoaded];
}
