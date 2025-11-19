import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour la persistance dans LocalStorage
 * Auto-save et auto-load des données
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    // État lazy initialisé depuis localStorage
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error loading ${key} from localStorage:`, error);
            return initialValue;
        }
    });

    // Sauvegarder dans localStorage à chaque changement
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const;
}

/**
 * Effacer toutes les données sauvegardées (pour reset)
 */
export function clearAllData() {
    const keys = ['axiom_notes', 'axiom_completed_ideas'];
    keys.forEach(key => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error clearing ${key}:`, error);
        }
    });
}

/**
 * Exporter toutes les données en JSON pour backup
 */
export function exportAllData() {
    const data = {
        notes: localStorage.getItem('axiom_notes'),
        completedIdeas: localStorage.getItem('axiom_completed_ideas'),
        exportDate: new Date().toISOString(),
        version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `axiom-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Importer des données depuis un backup JSON
 */
export function importData(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                if (data.notes) localStorage.setItem('axiom_notes', data.notes);
                if (data.completedIdeas) localStorage.setItem('axiom_completed_ideas', data.completedIdeas);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}
