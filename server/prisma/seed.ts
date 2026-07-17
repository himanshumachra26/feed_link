import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = (p: string) => bcrypt.hash(p, 10);

  console.log('🧹 Cleaning up database...');
  await prisma.rating.deleteMany();
  await prisma.request.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.actionLog.deleteMany();
  await prisma.foodRequest.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Seeding users...');

  // Admin Account
  const admin = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: await hash('Demo@1234'),
      role: 'ADMIN',
      orgName: 'FeedLink Admin Portal',
      verified: true,
    },
  });

  // 10 Restaurant (Donor) Accounts
  const donors = [];
  const donorNames = [
    { name: 'The Spice Garden Restaurant', email: 'donor1@demo.com', address: '12, Marine Lines, Mumbai' },
    { name: 'Sunrise Café & Bistro', email: 'donor2@demo.com', address: '5, Colaba Causeway, Mumbai' },
    { name: 'Pizza Corner Juhu', email: 'donor3@demo.com', address: '18, Juhu Beach Road, Mumbai' },
    { name: 'Green Garden Organics', email: 'donor4@demo.com', address: '8, Carter Road, Bandra West, Mumbai' },
    { name: 'Taj Palace Banquet Hall', email: 'donor5@demo.com', address: 'Gateway of India, Colaba, Mumbai' },
    { name: 'Urban Bakery Andheri', email: 'donor6@demo.com', address: '45, Link Road, Andheri West, Mumbai' },
    { name: 'Subway Bandra', email: 'donor7@demo.com', address: 'Shop 4, Hill Road, Bandra West, Mumbai' },
    { name: 'Tandoori Nights Restaurant', email: 'donor8@demo.com', address: '102, Linking Road, Khar, Mumbai' },
    { name: 'Healthy Salads & Bowls', email: 'donor9@demo.com', address: '22, High Street Phoenix, Lower Parel, Mumbai' },
    { name: 'McDonalds Chembur', email: 'donor10@demo.com', address: 'Central Avenue, Chembur, Mumbai' }
  ];

  for (let i = 0; i < donorNames.length; i++) {
    const d = donorNames[i];
    const created = await prisma.user.create({
      data: {
        email: d.email,
        password: await hash('Demo@1234'),
        role: 'DONOR',
        orgName: d.name,
        phone: `+91 98765 000${String(i).padStart(2, '0')}`,
        city: 'Mumbai',
        address: d.address,
        verified: true,
        createdAt: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), // Accounts created 2 years ago
      }
    });
    donors.push(created);
  }

  // 4 NGO Accounts
  const ngos = [];
  const ngoNames = [
    { name: 'Paws & Care Animal Shelter', email: 'ngo1@demo.com', address: '45, Bandra West, Mumbai' },
    { name: 'Hope Foundation Shelter', email: 'ngo2@demo.com', address: '101, Dharavi Main Road, Mumbai' },
    { name: 'City Rescue Food Bank', email: 'ngo3@demo.com', address: '14, Sion East, Mumbai' },
    { name: 'Feed the Need NGO', email: 'ngo4@demo.com', address: '77, Kurla West, Mumbai' }
  ];

  for (let i = 0; i < ngoNames.length; i++) {
    const n = ngoNames[i];
    const created = await prisma.user.create({
      data: {
        email: n.email,
        password: await hash('Demo@1234'),
        role: 'NGO',
        orgName: n.name,
        phone: `+91 87654 000${String(i).padStart(2, '0')}`,
        city: 'Mumbai',
        address: n.address,
        verified: true,
        createdAt: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000),
      }
    });
    ngos.push(created);
  }

  // Setup Date ranges for generating historical listings/requests
  const today = new Date();
  
  console.log('📦 Seeding historical listings and request records...');

  // Generate 50 historical COMPLETED listings over the last 2 years (approx 2 per month)
  // to make it look like they "deals good from last 2 years"
  const foodItems = [
    { title: 'Vegetable Biryani surplus', type: 'vegetarian', qty: 25, unit: 'servings', suitable: 'dogs,cattle,all' },
    { title: 'Freshly baked bread batches', type: 'baked-goods', qty: 15, unit: 'kg', suitable: 'birds,dogs' },
    { title: 'Surplus Dal and steamed Rice', type: 'vegetarian', qty: 40, unit: 'servings', suitable: 'dogs,cattle,all' },
    { title: 'Cooked Chicken bones and scraps', type: 'non-vegetarian', qty: 10, unit: 'kg', suitable: 'dogs,cats' },
    { title: 'Mixed vegetable curry', type: 'vegetarian', qty: 30, unit: 'servings', suitable: 'cattle,dogs' },
    { title: 'Unsold Sandwiches & Wraps', type: 'vegetarian', qty: 20, unit: 'boxes', suitable: 'dogs,birds' }
  ];

  let recordCount = 0;
  // We want to generate historical records spread over 730 days (2 years)
  for (let dayOffset = 730; dayOffset > 2; dayOffset -= 15) {
    const recordDate = new Date(today.getTime() - dayOffset * 24 * 60 * 60 * 1000);
    const donor = donors[recordCount % donors.length];
    const ngo = ngos[recordCount % ngos.length];
    const food = foodItems[recordCount % foodItems.length];

    // Create a listing that was completed in the past
    const listing = await prisma.listing.create({
      data: {
        donorId: donor.id,
        title: food.title,
        description: `Surplus food from daily operations. Kept under proper refrigeration.`,
        foodType: food.type,
        quantity: food.qty,
        unit: food.unit,
        suitableFor: food.suitable,
        status: 'COLLECTED', // past listing completed
        pickupStart: new Date(recordDate.getTime() + 2 * 60 * 60 * 1000),
        pickupEnd: new Date(recordDate.getTime() + 6 * 60 * 60 * 1000),
        address: donor.address || 'Mumbai',
        city: 'Mumbai',
        expiresAt: new Date(recordDate.getTime() + 10 * 60 * 60 * 1000),
        createdAt: recordDate,
      }
    });

    // Create request for it
    const request = await prisma.request.create({
      data: {
        listingId: listing.id,
        ngoId: ngo.id,
        status: 'COMPLETED',
        message: 'Requesting this for our shelter food drive.',
        createdAt: recordDate,
        updatedAt: new Date(recordDate.getTime() + 4 * 60 * 60 * 1000),
      }
    });

    // Create positive rating (deals good!)
    await prisma.rating.create({
      data: {
        fromId: ngo.id,
        toId: donor.id,
        requestId: request.id,
        score: (recordCount % 4 === 0) ? 4 : 5, // 4 or 5 stars ratings
        review: 'Excellent coordination and fresh food. Highly recommended!',
        createdAt: new Date(recordDate.getTime() + 5 * 60 * 60 * 1000),
      }
    });

    // Log the actions
    await prisma.actionLog.create({
      data: {
        userId: donor.id,
        action: 'CREATED',
        entity: 'LISTING',
        entityId: listing.id,
        details: listing.title,
        createdAt: recordDate,
      }
    });

    await prisma.actionLog.create({
      data: {
        userId: ngo.id,
        action: 'COMPLETED',
        entity: 'DONATION_REQUEST',
        entityId: request.id,
        details: listing.title,
        createdAt: new Date(recordDate.getTime() + 4 * 60 * 60 * 1000),
      }
    });

    recordCount++;
  }

  console.log(`📊 Generated ${recordCount} past completed transactions with 5-star ratings.`);

  console.log(`🍕 Seeding active/pending data for today (${today.toLocaleDateString()})...`);

  // Create 4 active listings available today
  const activeListingsData = [
    { donor: donors[0], title: 'Leftover Rice & Sambhar', type: 'vegetarian', qty: 25, unit: 'servings', suitable: 'dogs,cattle,all' },
    { donor: donors[1], title: 'Day-old Muffins & Croissants', type: 'baked-goods', qty: 12, unit: 'kg', suitable: 'birds,dogs' },
    { donor: donors[2], title: 'Surplus Margherita Pizzas', type: 'vegetarian', qty: 15, unit: 'boxes', suitable: 'dogs,cats' },
    { donor: donors[4], title: 'Cooked Mutton Scraps', type: 'non-vegetarian', qty: 8, unit: 'kg', suitable: 'dogs' }
  ];

  for (let i = 0; i < activeListingsData.length; i++) {
    const active = activeListingsData[i];
    const listing = await prisma.listing.create({
      data: {
        donorId: active.donor.id,
        title: active.title,
        description: 'Fresh and hygienic surplus food from today\'s batch.',
        foodType: active.type,
        quantity: active.qty,
        unit: active.unit,
        suitableFor: active.suitable,
        status: i === 3 ? 'RESERVED' : 'AVAILABLE',
        pickupStart: new Date(today.getTime() + 1 * 60 * 60 * 1000),
        pickupEnd: new Date(today.getTime() + 6 * 60 * 60 * 1000),
        address: active.donor.address || 'Mumbai',
        city: 'Mumbai',
        expiresAt: new Date(today.getTime() + 12 * 60 * 60 * 1000),
        createdAt: today,
      }
    });

    // For the first active listing, add a pending request from NGO 1
    if (i === 0) {
      const request = await prisma.request.create({
        data: {
          listingId: listing.id,
          ngoId: ngos[0].id,
          status: 'PENDING',
          message: 'Can pick this up by 3:00 PM for our afternoon shelter distribution.',
          createdAt: today,
        }
      });

      await prisma.notification.create({
        data: {
          userId: active.donor.id,
          type: 'REQUEST_RECEIVED',
          title: 'New Food Request',
          body: `${ngos[0].orgName} requested your listing: ${listing.title}`,
          createdAt: today,
        }
      });
    }

    // For the second active listing, add a pending request from NGO 2
    if (i === 1) {
      await prisma.request.create({
        data: {
          listingId: listing.id,
          ngoId: ngos[1].id,
          status: 'PENDING',
          message: 'Ideal for our community shelter. We can transport it.',
          createdAt: today,
        }
      });
    }

    // For the fourth listing (RESERVED), create an accepted request that is in transit (PICKED_UP)
    if (i === 3) {
      const request = await prisma.request.create({
        data: {
          listingId: listing.id,
          ngoId: ngos[2].id,
          status: 'PICKED_UP',
          message: 'Accepting this and sending our transit team right away.',
          createdAt: new Date(today.getTime() - 2 * 60 * 60 * 1000),
          updatedAt: new Date(today.getTime() - 30 * 60 * 1000), // marked picked up 30 mins ago
        }
      });

      await prisma.notification.create({
        data: {
          userId: ngos[2].id,
          type: 'REQUEST_ACCEPTED',
          title: 'Donation Request Approved',
          body: `Your request for "${listing.title}" has been accepted!`,
          createdAt: new Date(today.getTime() - 1 * 60 * 60 * 1000),
        }
      });
    }
  }

  console.log('\n✅ Seed finished! Database populated with 10 Donors, 4 NGOs, and 2-years of completed good deals history.');
  console.log('\nNGO Accounts (Password: Demo@1234):');
  ngos.forEach(n => console.log(`  📧 ${n.email}  -> ${n.orgName}`));
  console.log('\nDonor/Restaurant Accounts (Password: Demo@1234):');
  donors.forEach(d => console.log(`  📧 ${d.email}  -> ${d.orgName}`));
  console.log('\nAdmin Account (Password: Demo@1234):');
  console.log(`  📧 admin@demo.com -> FeedLink Admin`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
