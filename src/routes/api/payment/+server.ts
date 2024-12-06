import { json } from '@sveltejs/kit';
import { bookings, payments } from '$lib/db/schema'; // Drizzle ORM models
import type { RequestEvent } from './$types';
import db from '$lib/server/+server';

export async function POST(event: RequestEvent) {
    try {
        const {
            email,
            fullNames,
            tripId,
            paymentStatus,
            paymentMethod,
            tripDate,
            paymentReference,
            amount
        } = await event.request.json();

        // Create a new booking record
        const newBooking = await db.insert(bookings).values({
            email,
            tripId,
            tripDate,
            fullNames,
            paymentStatus
        }).returning();

        const bookingId = newBooking[0].id;

        // Create a new payment record associated with the booking
        const newPayment = await db.insert(payments).values({
            amount,
            bookingId,
            paymentMethod,
            paymentStatus,
            paymentReference,
        }).returning();

        // Return the created booking and payment records as response
        return json({
            booking: newBooking[0],
            payment: newPayment[0],
            message: 'Booking and payment processed successfully!',
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        return json(
            { error: 'Failed to process booking and payment' },
            { status: 500 }
        );
    }
}
