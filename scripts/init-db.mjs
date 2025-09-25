#!/usr/bin/env node

/**
 * Script pour initialiser la base de données D1 avec le schéma requis
 * Usage: node scripts/init-db.mjs
 */

import fs from 'fs';
import path from 'path';

const schema = `
-- Schema pour Cloudflare D1
-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    is_available INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Table des ingrédients
CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER REFERENCES products(id),
    name TEXT NOT NULL,
    is_removable INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0
);

-- Table des créneaux horaires
CREATE TABLE IF NOT EXISTS time_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    is_available INTEGER DEFAULT 1,
    order_id INTEGER REFERENCES orders(id)
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    total_amount REAL NOT NULL,
    pickup_date TEXT NOT NULL,
    pickup_time TEXT NOT NULL,
    stripe_session_id TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Table des articles de commande
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    customizations TEXT,
    subtotal REAL NOT NULL
);

-- Table des utilisateurs admin
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Table de configuration restaurant
CREATE TABLE IF NOT EXISTS restaurant_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_ingredients_product_id ON ingredients(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(pickup_date);
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(date);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
`;

async function initDatabase() {
  console.log("🚀 Initialisation de la base de données D1...\n");

  try {
    // Écrire le schéma dans un fichier temporaire
    const schemaPath = path.join(process.cwd(), 'temp-schema.sql');
    fs.writeFileSync(schemaPath, schema);

    console.log("📝 Schéma SQL généré");
    console.log("⚡ Prochaines étapes pour Cloudflare Pages:");
    console.log();
    console.log("1. Déployez votre application sur Cloudflare Pages");
    console.log("2. Connectez-vous au tableau de bord Cloudflare");
    console.log("3. Allez dans Workers & Pages > D1 SQL Database");
    console.log("4. Sélectionnez votre base de données 'burger'");
    console.log("5. Cliquez sur 'Console' et exécutez le schéma suivant:");
    console.log();
    console.log("-- COPIEZ ET COLLEZ CE SCHÉMA DANS LA CONSOLE D1:");
    console.log("=" .repeat(60));
    console.log(schema);
    console.log("=" .repeat(60));
    console.log();
    console.log("6. Une fois exécuté, votre base de données sera prête!");
    console.log();
    console.log("💡 Alternative: Utilisez wrangler CLI si vous l'avez configuré:");
    console.log("   wrangler d1 execute burger --file=temp-schema.sql");
    console.log();

    // Nettoyer le fichier temporaire
    fs.unlinkSync(schemaPath);

  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error.message);
  }
}

initDatabase();
