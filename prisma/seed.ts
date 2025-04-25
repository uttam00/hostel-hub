const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding...");

  // Create users with different roles
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create a student user
  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      name: "Student User",
      password: hashedPassword,
      role: "STUDENT",
    },
  });

  // Create a hostel admin user
  const hostelAdmin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Hostel Admin",
      password: hashedPassword,
      role: "HOSTEL_ADMIN",
    },
  });

  // Create a super admin user
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      email: "superadmin@example.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  // Create hostels
  const hostel1 = await prisma.hostel.upsert({
    where: { id: "hostel-1" },
    update: {},
    create: {
      id: "hostel-1",
      name: "Sunshine Hostel",
      description:
        "A cozy hostel in the heart of the city with modern amenities.",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      latitude: 40.7128,
      longitude: -74.006,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      amenities: ["WiFi", "Laundry", "Kitchen", "Common Room"],
      admins: {
        connect: { id: hostelAdmin.id },
      },
    },
  });

  const hostel2 = await prisma.hostel.upsert({
    where: { id: "hostel-2" },
    update: {},
    create: {
      id: "hostel-2",
      name: "Mountain View Hostel",
      description: "A peaceful hostel with beautiful mountain views.",
      address: "456 Oak Ave",
      city: "Denver",
      state: "CO",
      zipCode: "80201",
      country: "USA",
      latitude: 39.7392,
      longitude: -104.9903,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      amenities: ["WiFi", "Parking", "Garden", "BBQ Area"],
      admins: {
        connect: { id: hostelAdmin.id },
      },
    },
  });

  // Create rooms for hostel1
  await prisma.room.upsert({
    where: { id: "room-1" },
    update: {},
    create: {
      id: "room-1",
      roomNumber: "101",
      roomType: "SINGLE",
      description: "Cozy single room with a desk",
      price: 50,
      capacity: 1,
      isAvailable: true,
      amenities: ["WiFi", "Desk", "Private Bathroom"],
      hostelId: hostel1.id,
    },
  });

  await prisma.room.upsert({
    where: { id: "room-2" },
    update: {},
    create: {
      id: "room-2",
      roomNumber: "102",
      roomType: "DOUBLE",
      description: "Spacious double room with two beds",
      price: 80,
      capacity: 2,
      isAvailable: true,
      amenities: ["WiFi", "TV", "Shared Bathroom"],
      hostelId: hostel1.id,
    },
  });

  // Create rooms for hostel2
  await prisma.room.upsert({
    where: { id: "room-3" },
    update: {},
    create: {
      id: "room-3",
      roomNumber: "201",
      roomType: "TRIPLE",
      description: "Triple room with three single beds",
      price: 120,
      capacity: 3,
      isAvailable: true,
      amenities: ["WiFi", "TV", "Shared Bathroom"],
      hostelId: hostel2.id,
    },
  });

  await prisma.room.upsert({
    where: { id: "room-4" },
    update: {},
    create: {
      id: "room-4",
      roomNumber: "202",
      roomType: "DORMITORY",
      description: "Dormitory with 6 bunk beds",
      price: 30,
      capacity: 12,
      isAvailable: true,
      amenities: ["WiFi", "Lockers", "Shared Bathroom"],
      hostelId: hostel2.id,
    },
  });

  // Create reviews
  await prisma.review.upsert({
    where: { id: "review-1" },
    update: {},
    create: {
      id: "review-1",
      rating: 5,
      comment: "Great place to stay! Very clean and friendly staff.",
      userId: student.id,
      hostelId: hostel1.id,
    },
  });

  await prisma.review.upsert({
    where: { id: "review-2" },
    update: {},
    create: {
      id: "review-2",
      rating: 4,
      comment: "Nice location but a bit noisy at night.",
      userId: student.id,
      hostelId: hostel2.id,
    },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
