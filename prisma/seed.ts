const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Hash the password
  const hashedPassword = await bcrypt.hash("iMedia@009", 10);

  // Create Users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "student@example.com" },
      update: {},
      create: {
        name: "Student User",
        email: "student@example.com",
        password: hashedPassword,
        role: "STUDENT",
      },
    }),
    prisma.user.upsert({
      where: { email: "hosteladmin@example.com" },
      update: {},
      create: {
        name: "Hostel Admin",
        email: "hosteladmin@example.com",
        password: hashedPassword,
        role: "HOSTEL_ADMIN",
      },
    }),
    prisma.user.upsert({
      where: { email: "superadmin@example.com" },
      update: {},
      create: {
        name: "Super Admin",
        email: "superadmin@example.com",
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    }),
  ]);

  // Create Hostels
  const hostels = await Promise.all([
    prisma.hostel.create({
      data: {
        name: "University Heights",
        description: "Modern hostel near university campus",
        address: "123 University Ave",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        latitude: 40.7128,
        longitude: -74.006,
        amenities: ["WiFi", "Laundry", "Kitchen", "Study Room"],
        images: ["image1.jpg", "image2.jpg"],
        admins: {
          connect: [{ id: users[1].id }],
        },
      },
    }),
    prisma.hostel.create({
      data: {
        name: "Campus Living",
        description: "Affordable student accommodation",
        address: "456 College St",
        city: "Boston",
        state: "MA",
        zipCode: "02108",
        country: "USA",
        latitude: 42.3601,
        longitude: -71.0589,
        amenities: ["WiFi", "Gym", "Common Room"],
        images: ["image3.jpg", "image4.jpg"],
        admins: {
          connect: [{ id: users[1].id }],
        },
      },
    }),
    prisma.hostel.create({
      data: {
        name: "Student Haven",
        description: "Comfortable living for students",
        address: "789 Student Blvd",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
        latitude: 41.8781,
        longitude: -87.6298,
        amenities: ["WiFi", "Laundry", "Kitchen"],
        images: ["image5.jpg", "image6.jpg"],
        admins: {
          connect: [{ id: users[1].id }],
        },
      },
    }),
  ]);

  // Create Rooms
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        roomNumber: "101",
        roomType: "SINGLE",
        description: "Single room with study desk",
        price: 500.0,
        capacity: 1,
        amenities: ["WiFi", "Desk", "Wardrobe"],
        hostelId: hostels[0].id,
      },
    }),
    prisma.room.create({
      data: {
        roomNumber: "102",
        roomType: "DOUBLE",
        description: "Double room with shared bathroom",
        price: 800.0,
        capacity: 2,
        amenities: ["WiFi", "Desk", "Wardrobe", "Shared Bathroom"],
        hostelId: hostels[0].id,
      },
    }),
    prisma.room.create({
      data: {
        roomNumber: "201",
        roomType: "TRIPLE",
        description: "Triple room with private bathroom",
        price: 1200.0,
        capacity: 3,
        amenities: ["WiFi", "Desk", "Wardrobe", "Private Bathroom"],
        hostelId: hostels[1].id,
      },
    }),
  ]);

  // Create Bookings
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        checkIn: new Date("2024-03-01"),
        checkOut: new Date("2024-06-30"),
        status: "CONFIRMED",
        totalPrice: 2000.0,
        userId: users[0].id,
        roomId: rooms[0].id,
      },
    }),
    prisma.booking.create({
      data: {
        checkIn: new Date("2024-03-15"),
        checkOut: new Date("2024-07-15"),
        status: "PENDING",
        totalPrice: 3200.0,
        userId: users[0].id,
        roomId: rooms[1].id,
      },
    }),
  ]);

  // Create Payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        amount: 2000.0,
        status: "COMPLETED",
        method: "Credit Card",
        bookingId: bookings[0].id,
      },
    }),
    prisma.payment.create({
      data: {
        amount: 3200.0,
        status: "PENDING",
        method: "Bank Transfer",
        bookingId: bookings[1].id,
      },
    }),
  ]);

  // Create Reviews
  await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: "Great place to stay!",
        userId: users[0].id,
        hostelId: hostels[0].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: "Good facilities but a bit noisy",
        userId: users[0].id,
        hostelId: hostels[1].id,
      },
    }),
  ]);

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
