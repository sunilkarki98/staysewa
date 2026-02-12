import { db, client } from '@/db/index';
import { users, properties, propertyUnits, propertyMedia } from '@/db/schema/index';
import slugify from 'slugify';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

const seed = async () => {
    console.log('🏔️ Starting Principal Marketplace Seeding (Nepal Focused)...');

    const email = 'john_owner@staysewa.com';
    const rawPassword = 'password123';

    try {
        const hashedPassword = await bcrypt.hash(rawPassword, 12);

        // 1. Setup/Update Base Owner
        console.log('👤 Setting up owner account...');
        let ownerJohn;
        const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (existingUsers.length > 0) {
            [ownerJohn] = await db.update(users)
                .set({ password: hashedPassword, full_name: 'John Bahadur Owner', updated_at: new Date() })
                .where(eq(users.email, email))
                .returning();
            console.log('✅ Owner updated.');
        } else {
            [ownerJohn] = await db.insert(users).values({
                email: email,
                password: hashedPassword,
                full_name: 'John Bahadur Owner',
                phone: '9841234567',
                role: 'owner',
                email_verified: true,
            }).returning();
            console.log('✅ Owner created.');
        }

        // 2. PROPERTY: Hostel (Kathmandu)
        const hostelName = 'Kathmandu Valley Backpackers';
        const hostelSlug = slugify(hostelName, { lower: true });

        const existingProperties = await db.select().from(properties).where(eq(properties.slug, hostelSlug)).limit(1);
        let hostel;
        if (existingProperties.length === 0) {
            [hostel] = await db.insert(properties).values({
                owner_id: ownerJohn.id,
                name: hostelName,
                slug: hostelSlug,
                type: 'hostel',
                address_line: 'Bhagwati Marg, Thamel',
                city: 'Kathmandu',
                district: 'Kathmandu',
                province: 'Bagmati',
                base_price: 800,
                description: 'The ultimate social hub for backpackers in Nepal.',
                status: 'active',
                amenities: ['Free WiFi', 'Communal Kitchen', 'Roof Terrace'],
            }).returning();

            // Units for Hostel
            await db.insert(propertyUnits).values([
                {
                    property_id: hostel.id,
                    name: 'Single Seater Private',
                    type: 'bed',
                    max_occupancy: 1,
                    base_price: 2000,
                    quantity: 5,
                },
                {
                    property_id: hostel.id,
                    name: 'Standard Twin Room',
                    type: 'private_room',
                    max_occupancy: 2,
                    base_price: 3000,
                    quantity: 3,
                }
            ]);

            await db.insert(propertyMedia).values([
                { property_id: hostel.id, url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5', is_cover: true }
            ]);
            console.log('✅ Hostel added.');
        } else {
            console.log('ℹ️ Property already exists, skipping.');
        }

        console.log(`🚀 Seeding Complete!`);
        console.log(`🔑 Login Email: ${email}`);
        console.log(`🔑 Login Password: ${rawPassword}`);

    } catch (err) {
        console.error('❌ Principal Seeding Failed:', err);
        process.exit(1);
    } finally {
        await client.end();
        process.exit(0);
    }
};

seed();
