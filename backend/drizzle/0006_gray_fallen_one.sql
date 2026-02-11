ALTER TABLE "reviews" DROP CONSTRAINT "reviews_booking_id_unique";--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_reviewer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_booking_id_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_stay_id_stays_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_stay_id_stays_id_fk" FOREIGN KEY ("stay_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "reviewer_id";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "cleanliness";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "value";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "communication";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "owner_reply";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "owner_replied_at";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "is_visible";--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "rating_check" CHECK ("reviews"."rating" >= 1 AND "reviews"."rating" <= 5);