import { z } from "zod";

// Common schema for hostel
const baseHostelSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  amenities: z.array(z.string()),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

// Schema for hostel
export const hostelSchema = baseHostelSchema.extend({
  images: z.array(z.string()).min(1, "At least one image is required"),
  totalRooms: z.number().min(1, "Must have at least 1 room"),
  adminId: z.string().optional(),
  averageRating: z.number().default(0),
  reviewCount: z.number().default(0),
  availableRooms: z.number().default(0),
  lowestPrice: z.number().default(0),
});

// Schema for hostel creation
export const createHostelSchema = baseHostelSchema.extend({
  images: z.array(z.string()).default([]),
});

//Schema for hostel update
export const hostelUpdateSchema = baseHostelSchema.partial().extend({
  images: z.array(z.string()).optional(),
  averageRating: z.number().optional(),
  reviewCount: z.number().optional(),
  availableRooms: z.number().optional(),
  lowestPrice: z.number().optional(),
  totalRooms: z.number().min(1, "Must have at least 1 room"),
  adminId: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]), // keep required if needed
});

//Schema for change password
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z
      .string()
      .min(6)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Schema for Register auth user
export const baseRegisterUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "HOSTEL_ADMIN"]).default("STUDENT"),
});

// For client-side form validation (includes confirmPassword + refinement)
export const registerUserSchemaWithConfirm = baseRegisterUserSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Schema for updating profile
export const updateProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  image: z.string(),
});

//Schema for Booking creation
export const createBookingSchema = z.object({
  roomId: z.string().cuid("Invalid room ID"),
  checkIn: z.string().transform((str) => new Date(str)),
  checkOut: z.string().transform((str) => new Date(str)),
  totalPrice: z.number().positive("Total price must be positive"),
});

// Schema for update booking
export const bookingUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  checkIn: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  checkOut: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  totalPrice: z.number().positive("Total price must be positive").optional(),
});

// Schema for payment creation
export const paymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  method: z.string().min(1, "Payment method is required"),
});

// Schema for room update
export const roomUpdateSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required").optional(),
  roomType: z.enum(["SINGLE", "DOUBLE", "TRIPLE", "DORMITORY"]).optional(),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive").optional(),
  capacity: z
    .number()
    .int()
    .positive("Capacity must be a positive integer")
    .optional(),
  isAvailable: z.boolean().optional(),
  amenities: z.array(z.string()).optional(),
});

// Schema for adding/removing admin
export const adminSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

// Schema for adding hostel admin
export const createHostelAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  // password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for assigning hostels to hostel admin
export const assignHostelSchema = z.object({
  hostelIds: z.array(z.string()).min(1, "Please select at least one hostel"),
});

// Schema for review creation
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

// Schema for room creation
export const createRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  roomType: z.enum(["SINGLE", "DOUBLE", "TRIPLE", "DORMITORY"]),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
  isAvailable: z.boolean().default(true),
  amenities: z.array(z.string()).optional(),
});

// Schema for user login
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
