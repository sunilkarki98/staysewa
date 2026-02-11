CREATE INDEX "message_conversation_id_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "message_sender_id_idx" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "message_receiver_id_idx" ON "messages" USING btree ("receiver_id");--> statement-breakpoint
CREATE INDEX "message_booking_id_idx" ON "messages" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "notification_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "support_message_ticket_id_idx" ON "support_messages" USING btree ("ticket_id");--> statement-breakpoint
CREATE INDEX "support_ticket_user_id_idx" ON "support_tickets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "support_ticket_booking_id_idx" ON "support_tickets" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "support_ticket_assigned_to_idx" ON "support_tickets" USING btree ("assigned_to");