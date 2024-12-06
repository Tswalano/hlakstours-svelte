import { json } from '@sveltejs/kit';
import { bookings, payments, trips } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import db from '$lib/server/+server';

export async function GET({ url }) {
    try {
        const referance = url.searchParams.get('referance')

        if (referance) {
            // Fetch single trip by ID
            const bookingConfirmation = await db.select().from(bookings)
                .innerJoin(payments, eq(payments.bookingId, bookings.id))
                .innerJoin(trips, eq(bookings.tripId, trips.id))
                .where(eq(payments.paymentReference, referance))

            const data = {
                booking: bookingConfirmation[0].bookings,
                trip: bookingConfirmation[0].trips,
                payment: bookingConfirmation[0].payments
            }

            return json(data || null); // Return single trip or null if not found
        } else if (referance === null) {
            const allBookings = await db.select().from(bookings)
                .innerJoin(payments, eq(payments.bookingId, bookings.id))
                .innerJoin(trips, eq(bookings.tripId, trips.id))

            return json(allBookings || null); // Return all trip or null if not found
        }

        return json({ error: 'Referance not provided' }, { status: 400 });

    } catch (error) {
        console.error('Error fetching trips:', error);
        return json({ error: 'Failed to fetch trips' }, { status: 500 });
    }
}