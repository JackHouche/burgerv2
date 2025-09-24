import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Table des produits
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  category: text("category").notNull(), // 'burger', 'side', 'drink', 'dessert'
  imageUrl: text("image_url"), // URL R2
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Table des ingrédients
export const ingredients = sqliteTable("ingredients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").references(() => products.id),
  name: text("name").notNull(),
  isRemovable: integer("is_removable", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
});

// Table des créneaux horaires
export const timeSlots = sqliteTable("time_slots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(), // Format: YYYY-MM-DD
  time: text("time").notNull(), // Format: HH:MM
  isAvailable: integer("is_available", { mode: "boolean" }).default(true),
  orderId: integer("order_id").references(() => orders.id),
});

// Table des commandes
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, ready, completed
  totalAmount: real("total_amount").notNull(),
  pickupDate: text("pickup_date").notNull(),
  pickupTime: text("pickup_time").notNull(),
  stripeSessionId: text("stripe_session_id"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Table des articles de commande
export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  customizations: text("customizations"), // JSON des ingrédients modifiés
  subtotal: real("subtotal").notNull(),
});

// Table des utilisateurs admin
export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"), // admin, kitchen
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Table de configuration restaurant
export const restaurantConfig = sqliteTable("restaurant_config", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
