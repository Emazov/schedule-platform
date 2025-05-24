import { useState, useEffect } from 'react';

/**
 * Hook for working with localStorage, using user email as a key prefix
 * @param key Key for storing data
 * @param initialValue Initial value
 * @param userEmail User email (optional)
 * @returns [value, setValue] Value and function to change it
 */
export function useLocalStorage<T>(
	key: string,
	initialValue: T,
	userEmail?: string,
): [T, (value: T) => void] {
	// Creating a key with user email prefix
	const getStorageKey = () => {
		return userEmail ? `${userEmail}:${key}` : key;
	};

	// Getting data from localStorage
	const getStoredValue = (): T => {
		try {
			const storageKey = getStorageKey();
			const item = window.localStorage.getItem(storageKey);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(
				`Error reading localStorage for key ${getStorageKey()}:`,
				error,
			);
			return initialValue;
		}
	};

	// Hook state
	const [storedValue, setStoredValue] = useState<T>(getStoredValue);

	// Function to update the value
	const setValue = (value: T) => {
		try {
			// Save to state
			setStoredValue(value);

			// Save to localStorage
			const storageKey = getStorageKey();
			window.localStorage.setItem(storageKey, JSON.stringify(value));
		} catch (error) {
			console.error(
				`Error saving to localStorage for key ${getStorageKey()}:`,
				error,
			);
		}
	};

	// Update value when userEmail changes
	useEffect(() => {
		setStoredValue(getStoredValue());
	}, [userEmail]);

	return [storedValue, setValue];
}

export default useLocalStorage;
