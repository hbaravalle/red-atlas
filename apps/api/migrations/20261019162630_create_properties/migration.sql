CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"title" text NOT NULL,
	"description" text,
	"address" text,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"images" text[] DEFAULT '{}'::text[] NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"price" numeric(12,2) NOT NULL,
	"area" numeric(10,2),
	"owner_name" text,
	"owner_contact" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_type_check" CHECK ("type" IN ('apartment', 'house', 'office', 'land')),
	CONSTRAINT "properties_status_check" CHECK ("status" IN ('sale', 'rent'))
);
--> statement-breakpoint
CREATE INDEX "properties_created_at_idx" ON "properties" ("created_at");--> statement-breakpoint
CREATE INDEX "properties_price_idx" ON "properties" ("price");