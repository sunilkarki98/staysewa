import { users } from '@/db/schema/users';
import { InferSelectModel } from 'drizzle-orm';

// Define the User type from the schema
type User = InferSelectModel<typeof users>;

declare global {
    namespace Express {
        interface Request {
            // Add the user property to the Request interface
            // We omit the password as it is removed in the auth middleware
            user?: Omit<User, 'password'>;
        }
    }
}

export { };
