CREATE TABLE IF NOT EXISTS "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"bookingId" integer,
	"reference" text,
	"amount" integer,
	"paymentMethod" text,
	"paymentStatus" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "tripDate" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "fullNames" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "email" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_bookings_id_fk" FOREIGN KEY ("bookingId") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "startDate";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "numberOfPeople";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "totalAmount";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "depositPaid";--> statement-breakpoint
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "status";