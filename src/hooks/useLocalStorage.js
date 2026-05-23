import { useState, useEffect, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  const readLocalFallback = () => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readLocalFallback);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const isMounted = useRef(true);

  // Initialize and load data from the API
  useEffect(() => {
    isMounted.current = true;
    
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/data/${key}`);
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            if (data.value !== undefined) {
              if (isMounted.current) {
                setStoredValue(data.value);
                setUseFallback(false);
              }
              return;
            }
          }
        }
        throw new Error("API not available, falling back to local storage");
      } catch (error) {
        if (isMounted.current) {
          setUseFallback(true);
          setStoredValue(readLocalFallback());
        }
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
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (useFallback) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return;
      }
      
      const response = await fetch(`/api/data/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: valueToStore })
      });
      
      if (!response.ok) {
        setUseFallback(true);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      setUseFallback(true);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value instanceof Function ? value(storedValue) : value));
      }
    }
  };

  // Polling to sync state across different machines or sync across tabs
  useEffect(() => {
    if (useFallback) {
      const handleStorageChange = () => setStoredValue(readLocalFallback());
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    } else {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/data/${key}`);
          if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
              const data = await response.json();
              if (data.value !== undefined && isMounted.current) {
                setStoredValue(prev => {
                  if (JSON.stringify(prev) !== JSON.stringify(data.value)) {
                    return data.value;
                  }
                  return prev;
                });
              }
            }
          }
        } catch (error) {
          // Ignore
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [key, useFallback]);

  return [storedValue, setValue, isLoaded];
}
