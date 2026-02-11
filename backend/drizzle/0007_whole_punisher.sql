ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_stay_id_stays_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_booking_id_bookings_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_stay_id_stays_id_fk" FOREIGN KEY ("stay_id") REFERENCES "public"."stays"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booking_stay_id_idx" ON "bookings" USING btree ("stay_id");--> statement-breakpoint
CREATE INDEX "booking_customer_id_idx" ON "bookings" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "booking_owner_id_idx" ON "bookings" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "stay_unit_stay_id_idx" ON "stay_units" USING btree ("stay_id");--> statement-breakpoint
CREATE INDEX "stay_owner_id_idx" ON "stays" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "review_stay_id_idx" ON "reviews" USING btree ("stay_id");--> statement-breakpoint
CREATE INDEX "review_user_id_idx" ON "reviews" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_unique" UNIQUE("booking_id");