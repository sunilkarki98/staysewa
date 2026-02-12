import 'dotenv/config';
import { db, client } from './src/db/index';
// Use relative imports to bypass alias resolution issues in standalone script
import { stays, stayUnits, stayMedia } from './src/db/schema/properties';
import { users } from './src/db/schema/users';
import { commissions } from './src/db/schema/commissions';
import { count, eq } from 'drizzle-orm';

async function verify() {
    console.log('🔍 Principal Database Audit: JSON & Integrity Check\n');

    try {
        // 1. Properties & Dynamic Attributes
        const allStays = await db.select().from(stays);
        console.log(`🏠 PROPERTIES CHECK (${allStays.length} found)`);
        for (const s of allStays) {
            console.log(`\n--- [${s.type.toUpperCase()}] ${s.name} ---`);
            console.log(`📍 Location: ${s.city}, ${s.district}`);
            console.log(`⚙️  Attributes (JSON):`);
            console.dir(s.attributes, { depth: null, colors: true });

            // 2. Units & Unit-Level JSON
            const units = await db.select().from(stayUnits).where(eq(stayUnits.stayId, s.id));
            console.log(`   📦 UNITS: ${units.length}`);
            units.forEach(u => {
                console.log(`     * ${u.name} (Type: ${u.type}, Price: NPR ${u.basePrice})`);
                console.log(`       Unit Attrs: ${JSON.stringify(u.attributes)}`);
            });

            // 3. Media & Cover Flag
            const media = await db.select().from(stayMedia).where(eq(stayMedia.stayId, s.id));
            const cover = media.find(m => m.isCover);
            console.log(`   🖼️  MEDIA: ${media.length} items (Cover: ${cover ? '✅ ' + cover.label : '❌ MISSING'})`);
        }

        // 4. Owner Account
        const [owner] = await db.select().from(users).where(eq(users.email, 'john_owner@staysewa.com'));
        console.log(`\n👤 OWNER CHECK: john_owner@staysewa.com`);
        if (owner) {
            console.log(`   ✅ Account Verified: ${owner.fullName} (Role: ${owner.role})`);
            console.log(`   🔑 Password Set: ${owner.password ? 'Yes (Hashed)' : 'No'}`);
        } else {
            console.log(`   ❌ Owner account missing!`);
        }

        // 5. Commissions (Optional check)
        const [commCount] = await db.select({ value: count() }).from(commissions);
        console.log(`\n💰 COMMISSIONS: ${commCount.value} records prepared.`);

    } catch (err) {
        console.error('\n❌ Audit Failed:', err);
    } finally {
        await client.end();
        process.exit(0);
    }
}

verify();
