import { json } from '@sveltejs/kit';
import { bookings, trips } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import db from '$lib/server/+server';

// GET Handler
export async function GET({ url }) {
    try {
        const tripId = url.searchParams.get('id');

        if (tripId) {
            // Fetch single trip by ID
            const fetchedTrip = await db.select().from(trips).where(eq(trips.id, parseInt(tripId)));
            return json(fetchedTrip[0] || null); // Return single trip or null if not found
        }

        // Fetch all trips
        const fetchedTrips = await db.select().from(trips);
        return json(fetchedTrips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        return json({ error: 'Failed to fetch trips' }, { status: 500 });
    }
}

// POST Handler
export async function POST({ request }) {
    try {
        const { tripData, action } = await request.json();

        if(action === 'createTrip') {

        const newTrip = await db.insert(trips).values(tripData).returning();
        return json(newTrip[0]); // Return the inserted trip

         } else if(action === 'createBooking') {
            const newBooking = await db.insert(bookings).values(tripData).returning();
            return json(newBooking[0]); // Return the inserted booking
        }
    } catch (error) {
        console.error('Error creating trip:', error);
        return json({ error: 'Failed to create trip' }, { status: 500 });
    }
}
