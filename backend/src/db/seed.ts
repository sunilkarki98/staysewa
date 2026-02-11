import { db, client } from '@/db/index';
import { users, ownerProfiles, customerProfiles, stays, stayUnits, bookings } from '@/db/schema/index';

const seed = async () => {
    console.log('🌱 Seeding database...');

    try {
        // 1. Create Admin User
        const [adminUser] = await db.insert(users).values({
            email: 'admin@staysewa.com',
            fullName: 'Super Admin',
            role: 'admin',
            emailVerified: true,
        }).returning();
        console.log('Created Admin:', adminUser!.id);

        // 2. Create Owner User
        const [ownerUser] = await db.insert(users).values({
            email: 'owner@example.com',
            fullName: 'John Owner',
            phone: '9841000000',
            role: 'owner',
            emailVerified: true,
        }).returning();

        // Create Owner Profile
        await db.insert(ownerProfiles).values({
            userId: ownerUser!.id,
            businessName: 'Himalayan Hospitality',
            verificationStatus: 'verified',
        });
        console.log('Created Owner:', ownerUser!.id);

        // 3. Create Customer User
        const [customerUser] = await db.insert(users).values({
            email: 'guest@example.com',
            fullName: 'Alice Guest',
            phone: '9800000000',
            role: 'customer',
            emailVerified: true,
        }).returning();

        // Create Customer Profile
        await db.insert(customerProfiles).values({
            userId: customerUser!.id,
            nationality: 'Nepali',
        });
        console.log('Created Customer:', customerUser!.id);

        // 4. Create Stay
        const [stay] = await db.insert(stays).values({
            ownerId: ownerUser!.id,
            name: 'Cozy Himalayan Hostel',
            slug: 'cozy-himalayan-hostel',
            type: 'hostel',
            intent: 'short_stay',
            addressLine: 'Thamel Marg',
            city: 'Kathmandu',
            district: 'Kathmandu',
            province: 'Bagmati',
            basePrice: 1500, // 1500 NPR
            description: 'A beautiful hostel in the heart of Thamel.',
            status: 'active',
            amenities: ['wifi', 'hot_shower'],
        }).returning();
        console.log('Created Stay:', stay!.id);

        // 5. Create Stay Unit (Dorm Bed)
        const [unit] = await db.insert(stayUnits).values({
            stayId: stay!.id,
            name: 'Mixed Dorm Bed',
            type: 'bed',
            maxOccupancy: 1,
            basePrice: 1500,
            quantity: 10,
        }).returning();
        console.log('Created Unit:', unit!.id);

        // 6. Create Booking (Dynamic Dates)
        const today = new Date();
        const checkInDate = new Date(today);
        checkInDate.setDate(today.getDate() + 1); // Tomorrow
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkInDate.getDate() + 4); // 4 nights later

        // Format to YYYY-MM-DD for date type
        const formatDate = (d: Date) => d.toISOString().split('T')[0];

        await db.insert(bookings).values({
            bookingNumber: 'STY-SEED-001',
            stayId: stay!.id,
            unitId: unit!.id,
            customerId: customerUser!.id,
            ownerId: ownerUser!.id,
            guestName: customerUser!.fullName,
            guestEmail: customerUser!.email,
            guestPhone: customerUser!.phone,
            checkIn: formatDate(checkInDate),
            checkOut: formatDate(checkOutDate),
            nights: 4,
            baseAmount: 6000,
            totalAmount: 6000,
            status: 'confirmed',
            paymentStatus: 'paid',
        });
        console.log('Created Booking: STY-SEED-001');

        console.log('✅ Seeding complete!');
        await client.end();
        process.exit(0);

    } catch (err) {
        console.error('❌ Seeding failed:', err);
        await client.end();
        process.exit(1);
    }
};

seed();
