CREATE TYPE "public"."adjustment_type" AS ENUM('fixed', 'percent');--> statement-breakpoint
CREATE TYPE "public"."availability_status" AS ENUM('available', 'blocked', 'booked');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('initiated', 'reserved', 'confirmed', 'checked_in', 'completed', 'cancelled', 'expired', 'no_show', 'pending');--> statement-breakpoint
CREATE TYPE "public"."cancellation_type" AS ENUM('flexible', 'moderate', 'strict', 'non_refundable');--> statement-breakpoint
CREATE TYPE "public"."cancelled_by" AS ENUM('customer', 'owner', 'admin', 'system');--> statement-breakpoint
CREATE TYPE "public"."id_type" AS ENUM('citizenship', 'national_id_card', 'passport', 'national_id');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('in_app', 'email', 'sms', 'push');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('khalti', 'esewa', 'bank_transfer', 'cash', 'wallet');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('not_required', 'pending', 'success', 'failed', 'refunded', 'unpaid', 'paid');--> statement-breakpoint
CREATE TYPE "public"."payment_txn_status" AS ENUM('initiated', 'pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."price_rule_type" AS ENUM('seasonal', 'weekend', 'holiday', 'long_stay', 'last_minute');--> statement-breakpoint
CREATE TYPE "public"."stay_intent" AS ENUM('short_stay', 'long_stay', 'both');--> statement-breakpoint
CREATE TYPE "public"."stay_status" AS ENUM('draft', 'pending_review', 'active', 'suspended', 'archived');--> statement-breakpoint
CREATE TYPE "public"."stay_type" AS ENUM('hotel', 'homestay', 'apartment', 'room', 'hostel');--> statement-breakpoint
CREATE TYPE "public"."ticket_category" AS ENUM('booking', 'payment', 'property', 'account', 'other');--> statement-breakpoint
CREATE TYPE "public"."ticket_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('open', 'in_progress', 'waiting_customer', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."unit_type" AS ENUM('private_room', 'shared_room', 'entire_place', 'bed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('customer', 'owner', 'admin');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" "inet",
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_number" text NOT NULL,
	"stay_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"owner_id" uuid NOT NULL,
	"check_in" date NOT NULL,
	"check_out" date NOT NULL,
	"nights" integer NOT NULL,
	"guests_count" integer DEFAULT 1 NOT NULL,
	"guest_name" text NOT NULL,
	"guest_email" text,
	"guest_phone" text,
	"base_amount" integer NOT NULL,
	"taxes" integer DEFAULT 0,
	"service_fee" integer DEFAULT 0,
	"discount" integer DEFAULT 0,
	"total_amount" integer NOT NULL,
	"currency" text DEFAULT 'NPR',
	"status" "booking_status" DEFAULT 'initiated' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'not_required' NOT NULL,
	"expires_at" timestamp with time zone,
	"metadata" jsonb,
	"special_requests" text,
	"cancellation_reason" text,
	"cancelled_by" "cancelled_by",
	"cancelled_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "bookings_booking_number_unique" UNIQUE("booking_number")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'NPR',
	"method" "payment_method" NOT NULL,
	"gateway_txn_id" text,
	"gateway_response" jsonb,
	"status" "payment_txn_status" DEFAULT 'initiated' NOT NULL,
	"refund_amount" integer DEFAULT 0,
	"refund_reason" text,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "customer_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"date_of_birth" date,
	"nationality" text DEFAULT 'Nepali',
	"id_type" "id_type",
	"id_number" text,
	"id_front_url" text,
	"id_back_url" text,
	"emergency_contact" text,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "customer_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "owner_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"nationality" text DEFAULT 'Nepali',
	"business_name" text,
	"pan_number" text,
	"id_type" "id_type",
	"id_number" text,
	"id_front_url" text,
	"id_back_url" text,
	"bank_name" text,
	"bank_account" text,
	"address" text,
	"verification_status" "verification_status" DEFAULT 'pending',
	"total_earnings" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "owner_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"full_name" text NOT NULL,
	"avatar_url" text,
	"role" "user_role" DEFAULT 'customer' NOT NULL,
	"password" text,
	"email_verified" boolean DEFAULT false,
	"phone_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unit_id" uuid NOT NULL,
	"date" date NOT NULL,
	"available_count" integer NOT NULL,
	"price_override" integer,
	"min_nights" integer DEFAULT 1,
	"status" "availability_status" DEFAULT 'available'
);
--> statement-breakpoint
CREATE TABLE "cancellation_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stay_id" uuid,
	"type" "cancellation_type" DEFAULT 'moderate',
	"free_cancel_hours" integer DEFAULT 48,
	"refund_percent_before" integer DEFAULT 100,
	"refund_percent_after" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "cancellation_policies_stay_id_unique" UNIQUE("stay_id")
);
--> statement-breakpoint
CREATE TABLE "price_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stay_id" uuid NOT NULL,
	"unit_id" uuid,
	"name" text NOT NULL,
	"type" "price_rule_type" NOT NULL,
	"adjustment_type" "adjustment_type" NOT NULL,
	"adjustment_value" integer NOT NULL,
	"start_date" date,
	"end_date" date,
	"days_of_week" jsonb,
	"min_nights" integer,
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stay_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stay_id" uuid NOT NULL,
	"unit_id" uuid,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"type" "media_type" DEFAULT 'image',
	"caption" text,
	"sort_order" integer DEFAULT 0,
	"is_cover" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stay_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stay_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" "unit_type" NOT NULL,
	"max_occupancy" integer DEFAULT 2 NOT NULL,
	"base_price" integer NOT NULL,
	"quantity" integer DEFAULT 1,
	"amenities" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"type" "stay_type" NOT NULL,
	"intent" "stay_intent" DEFAULT 'both',
	"status" "stay_status" DEFAULT 'draft',
	"address_line" text NOT NULL,
	"city" text NOT NULL,
	"district" text NOT NULL,
	"province" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"base_price" integer NOT NULL,
	"max_guests" integer DEFAULT 2,
	"amenities" jsonb DEFAULT '[]'::jsonb,
	"rules" jsonb DEFAULT '[]'::jsonb,
	"check_in_time" time DEFAULT '14:00:00',
	"check_out_time" time DEFAULT '11:00:00',
	"avg_rating" numeric(2, 1) DEFAULT '0',
	"total_reviews" integer DEFAULT 0,
	"total_bookings" integer DEFAULT 0,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "stays_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"stay_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "reviews_booking_id_unique" UNIQUE("booking_id"),
	CONSTRAINT "rating_check" CHECK ("reviews"."rating" >= 1 AND "reviews"."rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"booking_id" uuid,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"data" jsonb DEFAULT '{}'::jsonb,
	"channel" "notification_channel" DEFAULT 'in_app',
	"is_read" boolean DEFAULT false,
	"read_at" timestamp with time zone,
	"sent_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text NOT NULL,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"is_internal" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_number" text NOT NULL,
	"user_id" uuid NOT NULL,
	"booking_id" uuid,
	"category" "ticket_category" NOT NULL,
	"subject" text NOT NULL,
	"priority" "ticket_priority" DEFAULT 'medium',
	"status" "ticket_status" DEFAULT 'open',
	"assigned_to" uuid,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "support_tickets_ticket_number_unique" UNIQUE("ticket_number")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_stay_id_stays_id_fk" FOREIGN KEY ("stay_id") REFERENCES "public"."stays"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_unit_id_stay_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."stay_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "owner_profiles" ADD CONSTRAINT "owner_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_unit_id_stay_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."stay_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cancellation_policies" ADD CONSTRAINT "cancellation_policies_stay_id_stays_id_fk" FOREIGN KEY ("stay_id") REFERENCES "public"."stays"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_rules" ADD CONSTRAINT "price_rules_stay_id_stays_id_fk" FOREIGN KEY ("stay_id") REFERENCES "public"."stays"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_rules" ADD CONSTRAINT "price_rules_unit_id_stay_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."stay_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stay_media" ADD CONSTRAINT "stay_media_stay_id_stays_id_fk" FOREIGN KEY ("stay_id") REFERENCES "public"."stays"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stay_media" ADD CONSTRAINT "stay_media_unit_id_stay_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."stay_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stay_units" ADD CONSTRAINT "stay_units_stay_id_stays_id_fk" FOREIGN KEY ("stay_id") REFERENCES "public"."stays"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stays" ADD CONSTRAINT "stays_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_stay_id_stays_id_fk" FOREIGN KEY ("stay_id") REFERENCES "public"."stays"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_ticket_id_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "booking_stay_id_idx" ON "bookings" USING btree ("stay_id");--> statement-breakpoint
CREATE INDEX "booking_customer_id_idx" ON "bookings" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "booking_owner_id_idx" ON "bookings" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "availability_unit_date_idx" ON "availability" USING btree ("unit_id","date");--> statement-breakpoint
CREATE INDEX "stay_unit_stay_id_idx" ON "stay_units" USING btree ("stay_id");--> statement-breakpoint
CREATE INDEX "stay_owner_id_idx" ON "stays" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "review_stay_id_idx" ON "reviews" USING btree ("stay_id");--> statement-breakpoint
CREATE INDEX "review_user_id_idx" ON "reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "message_conversation_id_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "message_sender_id_idx" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "message_receiver_id_idx" ON "messages" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "message_booking_id_idx" ON "messages" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "notification_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "support_message_ticket_id_idx" ON "support_messages" USING btree ("ticket_id");--> statement-breakpoint
CREATE INDEX "support_ticket_user_id_idx" ON "support_tickets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "support_ticket_booking_id_idx" ON "support_tickets" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "support_ticket_assigned_to_idx" ON "support_tickets" USING btree ("assigned_to");