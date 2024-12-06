// src/lib/stores/tripStore.ts
import { writable } from 'svelte/store';
import type { Trip } from '$lib/types/trip';

interface TripStore {
    trips: Trip[];
    loading: boolean;
    error: string | null;
}

function createTripStore() {
    const { subscribe, set, update } = writable<TripStore>({
        trips: [],
        loading: false,
        error: null
    });

    return {
        subscribe,
        setTrips: (trips: Trip[]) =>
            update(state => ({ ...state, trips, loading: false })),
        addTrip: (trip: Trip) =>
            update(state => ({
                ...state,
                trips: [...state.trips, trip],
                loading: false
            })),
        updateTrip: (id: string, updatedTrip: Partial<Trip>) =>
            update(state => ({
                ...state,
                trips: state.trips.map(trip =>
                    trip.id === parseInt(id) ? { ...trip, ...updatedTrip } : trip
                )
            })),
        deleteTrip: (id: string) =>
            update(state => ({
                ...state,
                trips: state.trips.filter(trip => trip.id !== parseInt(id))
            })),
        setLoading: (loading: boolean) =>
            update(state => ({ ...state, loading })),
        setError: (error: string | null) =>
            update(state => ({ ...state, error })),
        reset: () => set({ trips: [], loading: false, error: null })
    };
}

export const tripStore = createTripStore();