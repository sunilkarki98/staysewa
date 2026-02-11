CREATE TYPE "public"."id_type" AS ENUM('citizenship', 'national_id_card', 'passport', 'national_id');--> statement-breakpoint
ALTER TABLE "owner_profiles" RENAME COLUMN "citizenship_number" TO "id_number";--> statement-breakpoint
ALTER TABLE "customer_profiles" ALTER COLUMN "id_type" SET DATA TYPE "public"."id_type" USING "id_type"::"public"."id_type";--> statement-breakpoint
ALTER TABLE "customer_profiles" ADD COLUMN "id_front_url" text;--> statement-breakpoint
ALTER TABLE "customer_profiles" ADD COLUMN "id_back_url" text;--> statement-breakpoint
ALTER TABLE "owner_profiles" ADD COLUMN "id_type" "id_type";--> statement-breakpoint
ALTER TABLE "owner_profiles" ADD COLUMN "id_front_url" text;--> statement-breakpoint
ALTER TABLE "owner_profiles" ADD COLUMN "id_back_url" text;