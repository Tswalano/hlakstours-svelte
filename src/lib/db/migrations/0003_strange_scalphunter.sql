CREATE TABLE IF NOT EXISTS "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"tripId" integer,
	"tripDate" text,
	"fullNames" text,
	"email" text,
	"paymentStatus" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"fileName" text,
	"fileId" text,
	"fileType" text,
	"uploadedBy" text,
	"relatedTo" integer,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tripId_trips_id_fk" FOREIGN KEY ("tripId") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_relatedTo_trips_id_fk" FOREIGN KEY ("relatedTo") REFERENCES "public"."trips"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_bookings_id_fk" FOREIGN KEY ("bookingId") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
