import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getNotes, saveNotes, getIdeas, saveIdeas } from '../services/firebaseService';

/**
 * Hook de synchronisation automatique avec Firestore
 * Remplace useLocalStorage pour les utilisateurs authentifiés
 * Gère la migration automatique depuis LocalStorage
 */
export function useFirestoreSync<T>(
    key: 'notes' | 'ideas',
    initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const { currentUser } = useAuth();
    const [data, setData] = useState<T>(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from Firestore on mount or user change
    useEffect(() => {
        if (currentUser && !isLoaded) {
            const loadData = async () => {
                try {
                    const fetchFn = key === 'notes' ? getNotes : getIdeas;
                    const cloudData = await fetchFn(currentUser.uid);

                    if (cloudData && cloudData.length > 0) {
                        // Données cloud existantes
                        setData(cloudData);
                    } else {
                        // Pas de données cloud, vérifier LocalStorage pour migration
                        const localStorageKey = key === 'notes' ? 'axiom_notes' : 'axiom_completed_ideas';
                        const localData = localStorage.getItem(localStorageKey);

                        if (localData) {
                            const parsed = JSON.parse(localData);
                            console.log(`📦 Migration de ${key} depuis LocalStorage (${parsed.length} entrées)`);
                            setData(parsed);

                            // Sauvegarder dans le cloud
                            const saveFn = key === 'notes' ? saveNotes : saveIdeas;
                            await saveFn(currentUser.uid, parsed);

                            // Garder LocalStorage comme backup pour le moment
                            // On pourrait le supprimer plus tard après confirmation
                            console.log(`✅ Migration de ${key} terminée`);
                        }
                    }
                } catch (error) {
                    console.error(`❌ Erreur lors du chargement de ${key}:`, error);
                    // Fallback vers LocalStorage en cas d'erreur
                    const localStorageKey = key === 'notes' ? 'axiom_notes' : 'axiom_completed_ideas';
                    const localData = localStorage.getItem(localStorageKey);
                    if (localData) {
                        setData(JSON.parse(localData));
                    }
                } finally {
                    setIsLoaded(true);
                }
            };
            loadData();
        } else if (!currentUser) {
            // Pas d'utilisateur connecté, forcer le rechargement au prochain login
            setIsLoaded(false);
        }
    }, [currentUser, key, isLoaded]);

    // Save to Firestore on data change (debounced)
    useEffect(() => {
        if (currentUser && isLoaded) {
            const saveFn = key === 'notes' ? saveNotes : saveIdeas;
            const timeoutId = setTimeout(() => {
                saveFn(currentUser.uid, data as any).catch((error) => {
                    console.error(`❌ Erreur lors de la sauvegarde de ${key}:`, error);
                });
            }, 500); // Debounce de 500ms

            return () => clearTimeout(timeoutId);
        }
    }, [data, currentUser, key, isLoaded]);

    return [data, setData];
}
