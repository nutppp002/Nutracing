import { useState, useEffect, useRef, useCallback } from 'react';

// Call this to trigger an immediate refresh of all useLocalStorage hooks
export function triggerRefresh() {
  window.dispatchEvent(new CustomEvent('motofix_refresh'));
}

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

  const fetchFromApi = useCallback(async () => {
    try {
      const response = await fetch(`/api/data/${key}`);
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          if (isMounted.current) {
            if (data.value !== undefined) {
              setStoredValue(prev => {
                if (JSON.stringify(prev) !== JSON.stringify(data.value)) {
                  return data.value;
                }
                return prev;
              });
            }
            setUseFallback(false);
          }
          return;
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
  }, [key]);

  // Initialize and load data from the API
  useEffect(() => {
    isMounted.current = true;
    fetchFromApi();
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

  // Polling to sync state + listen for manual refresh event
  useEffect(() => {
    if (useFallback) {
      const handleStorageChange = () => setStoredValue(readLocalFallback());
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    } else {
      // Listen for manual refresh event
      const handleManualRefresh = () => fetchFromApi();
      window.addEventListener('motofix_refresh', handleManualRefresh);

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
      }, 15000);
      return () => {
        clearInterval(interval);
        window.removeEventListener('motofix_refresh', handleManualRefresh);
      };
    }
  }, [key, useFallback]);

  return [storedValue, setValue, isLoaded];
}
