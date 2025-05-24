import { useState, useEffect } from 'react';

/**
 * Хук для работы с localStorage, который использует email пользователя как префикс ключа
 * @param key Ключ для хранения данных
 * @param initialValue Начальное значение
 * @param userEmail Email пользователя (опционально)
 * @returns [value, setValue] Значение и функция для его изменения
 */
export function useLocalStorage<T>(
	key: string,
	initialValue: T,
	userEmail?: string,
): [T, (value: T) => void] {
	// Формирование ключа с учетом пользователя
	const getStorageKey = () => {
		return userEmail ? `${userEmail}:${key}` : key;
	};

	// Получение данных из localStorage
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

	// Состояние хука
	const [storedValue, setStoredValue] = useState<T>(getStoredValue);

	// Функция для обновления значения
	const setValue = (value: T) => {
		try {
			// Сохраняем в state
			setStoredValue(value);

			// Сохраняем в localStorage
			const storageKey = getStorageKey();
			window.localStorage.setItem(storageKey, JSON.stringify(value));
		} catch (error) {
			console.error(
				`Error saving to localStorage for key ${getStorageKey()}:`,
				error,
			);
		}
	};

	// При изменении userEmail обновляем значение
	useEffect(() => {
		setStoredValue(getStoredValue());
	}, [userEmail]);

	return [storedValue, setValue];
}

export default useLocalStorage;
