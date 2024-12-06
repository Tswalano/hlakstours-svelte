// Drizzle schema definitions (tables)

import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Trips table
export const trips = pgTable('trips', {
    id: serial('id').primaryKey(),
    name: text('name'),
    description: text('description'),
    durationDays: integer('durationDays'),
    durationNights: integer('durationNights'),
    price: integer('price'),
    deposit: integer('deposit'),
    date: text('date').array(),
    includes: text('includes').array(),
    location: text('location'),
    imageUrl: text('imageUrl'),
    galleryImages: text('galleryImages').array(),
    active: boolean('active'),
    status: text('status'),
    availableSlots: integer('availableSlots'),
    capacity: integer('capacity'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
});

// Bookings table
export const bookings = pgTable('bookings', {
    id: serial('id').primaryKey(),
    tripId: integer('tripId').references(() => trips.id),
    tripDate: text('tripDate'),
    fullNames: text('fullNames'),
    email: text('email'),
    paymentStatus: text('paymentStatus'), // "pending", "partial", "completed"
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
});

// payments table to store payment details linked to bookings
export const payments = pgTable('payments', {
    id: serial('id').primaryKey(),
    bookingId: integer('bookingId').references(() => bookings.id),
    amount: integer('amount'),
    paymentMethod: text('paymentMethod'),
    paymentStatus: text('paymentStatus'),
    paymentReference: text('reference'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
});

export const files = pgTable('files', {
    id: serial('id').primaryKey(),
    fileName: text('fileName'),
    fileId: text('fileId'),
    fileType: text('fileType'),
    uploadedBy: text('uploadedBy'),
    relatedTo: integer('relatedTo').references(() => trips.id),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
});