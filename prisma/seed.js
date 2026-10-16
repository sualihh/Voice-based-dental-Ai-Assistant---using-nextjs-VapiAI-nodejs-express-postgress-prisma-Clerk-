const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding sample doctors and user...');

  await prisma.doctor.upsert({
    where: { email: 'dr.alex@example.com' },
    update: {},
    create: {
      email: 'dr.alex@example.com',
      name: 'Dr. Alex Morgan',
      phone: '+1-555-0101',
      specialty: 'General Dentistry',
      bio: 'Seasoned general dentist focused on patient comfort and preventive care.',
      imageUrl: '/images/doctors/dr-alex.jpg',
      gender: 'MALE',
      isActive: true,
    },
  });

  await prisma.doctor.upsert({
    where: { email: 'dr.sofia@example.com' },
    update: {},
    create: {
      email: 'dr.sofia@example.com',
      name: 'Dr. Sofia Patel',
      phone: '+1-555-0202',
      specialty: 'Orthodontics',
      bio: 'Passionate about creating healthy, beautiful smiles for all ages.',
      imageUrl: '/images/doctors/dr-sofia.jpg',
      gender: 'FEMALE',
      isActive: true,
    },
  });

  // Seed a sample user for local testing (clerkId is a placeholder)
  await prisma.user.upsert({
    where: { clerkId: 'seed-clerk-1' },
    update: {},
    create: {
      clerkId: 'seed-clerk-1',
      email: 'patient@example.com',
      firstName: 'Seed',
      lastName: 'Patient',
      phone: '+1-555-9999',
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
