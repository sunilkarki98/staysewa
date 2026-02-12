import { db, client } from '@/db/index';
import { users, properties, propertyUnits, bookings } from '@/db/schema/index';

const seed = async () => {
    console.log('🌱 Seeding database...');

    try {
        // 1. Create Admin User
        const [adminUser] = await db.insert(users).values({
            email: 'admin@staysewa.com',
            full_name: 'Super Admin',
            role: 'admin',
            email_verified: true,
        }).returning();
        console.log('Created Admin:', adminUser!.id);

        // 2. Create Owner User
        const [ownerUser] = await db.insert(users).values({
            email: 'owner@example.com',
            full_name: 'John Owner',
            phone: '9841000000',
            role: 'owner',
            email_verified: true,
            bio: 'Experienced property owner in Thamel.',
        }).returning();
        console.log('Created Owner:', ownerUser!.id);

        // 3. Create Customer User
        const [customerUser] = await db.insert(users).values({
            email: 'guest@example.com',
            full_name: 'Alice Guest',
            phone: '9800000000',
            role: 'customer',
            email_verified: true,
        }).returning();
        console.log('Created Customer:', customerUser!.id);

        // 4. Create Property
        const [property] = await db.insert(properties).values({
            owner_id: ownerUser!.id,
            name: 'Cozy Himalayan Hostel',
            slug: 'cozy-himalayan-hostel',
            type: 'hostel',
            address_line: 'Thamel Marg',
            city: 'Kathmandu',
            district: 'Kathmandu',
            province: 'Bagmati',
            base_price: 1500,
            description: 'A beautiful hostel in the heart of Thamel.',
            status: 'active',
            amenities: ['wifi', 'hot_shower'],
        }).returning();
        console.log('Created Property:', property!.id);

        // 5. Create Property Unit (Dorm Bed)
        const [unit] = await db.insert(propertyUnits).values({
            property_id: property!.id,
            name: 'Mixed Dorm Bed',
            type: 'bed',
            max_occupancy: 1,
            base_price: 1500,
            quantity: 10,
        }).returning();
        console.log('Created Unit:', unit!.id);

        // 6. Create Booking (Dynamic Dates)
        const today = new Date();
        const checkInDate = new Date(today);
        checkInDate.setDate(today.getDate() + 1); // Tomorrow
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkInDate.getDate() + 4); // 4 nights later

        const formatDate = (d: Date) => d.toISOString().split('T')[0];

        await db.insert(bookings).values({
            booking_number: 'BK-SEED-001',
            property_id: property!.id,
            unit_id: unit!.id,
            customer_id: customerUser!.id,
            owner_id: ownerUser!.id,
            guest_name: customerUser!.full_name,
            guest_email: customerUser!.email,
            guest_phone: customerUser!.phone,
            check_in: formatDate(checkInDate),
            check_out: formatDate(checkOutDate),
            nights: 4,
            base_amount: 6000,
            total_amount: 6000,
            property_name: property!.name,
            unit_name: unit!.name,
            status: 'confirmed',
            payment_status: 'paid',
        });
        console.log('Created Booking: BK-SEED-001');

        console.log('✅ Seeding complete!');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    } finally {
        await client.end();
        process.exit(0);
    }
};

seed();
