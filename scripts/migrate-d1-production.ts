#!/usr/bin/env node

/**
 * Script pour migrer la base de données D1 en production
 * À exécuter avec wrangler depuis votre machine locale
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const MIGRATION_SQL = `
-- Migration initiale pour D1 Production
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('burger', 'side', 'drink', 'dessert')),
    imageUrl TEXT,
    isAvailable BOOLEAN DEFAULT TRUE,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    name TEXT NOT NULL,
    isRemovable BOOLEAN DEFAULT TRUE,
    sortOrder INTEGER DEFAULT 0,
    FOREIGN KEY (productId) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderNumber TEXT UNIQUE NOT NULL,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    customerPhone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed')),
    totalAmount INTEGER NOT NULL,
    pickupDate TEXT NOT NULL,
    pickupTime TEXT NOT NULL,
    notes TEXT,
    stripeSessionId TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unitPrice INTEGER NOT NULL,
    removedIngredients TEXT, -- JSON array of ingredient names
    FOREIGN KEY (orderId) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products (id)
);

CREATE TABLE IF NOT EXISTS time_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    isAvailable BOOLEAN DEFAULT TRUE,
    orderId INTEGER,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, time),
    FOREIGN KEY (orderId) REFERENCES orders (id)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(isAvailable);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_pickup ON orders(pickupDate, pickupTime);
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(date);
CREATE INDEX IF NOT EXISTS idx_time_slots_available ON time_slots(isAvailable);

-- Données d'exemple pour Block B
INSERT OR IGNORE INTO products (id, name, description, price, category, imageUrl, isAvailable) VALUES
(1, 'Block B Signature', 'Notre burger emblématique avec steak de bœuf, fromage aged cheddar, salade, tomate, oignons caramélisés et sauce Block B spéciale', 1200, 'burger', NULL, TRUE),
(2, 'BBQ Smoker', 'Steak de bœuf grillé, bacon fumé, fromage cheddar, oignons frits, sauce BBQ maison', 1350, 'burger', NULL, TRUE),
(3, 'Veggie Street', 'Steak végétarien maison, avocat, roquette, tomate, oignons rouges, sauce tahini', 1100, 'burger', NULL, TRUE),
(4, 'Frites Block B', 'Frites maison coupées à la main, assaisonnement secret Block B', 450, 'side', NULL, TRUE),
(5, 'Onion Rings', 'Rondelles d''oignons panées maison, sauce ranch', 550, 'side', NULL, TRUE),
(6, 'Cola Artisanal', 'Cola fait maison aux épices naturelles', 350, 'drink', NULL, TRUE),
(7, 'Brownie Block B', 'Brownie au chocolat noir, glace vanille, sauce caramel', 650, 'dessert', NULL, TRUE);

-- Ingrédients pour les burgers
INSERT OR IGNORE INTO ingredients (productId, name, isRemovable, sortOrder) VALUES
-- Block B Signature
(1, 'Steak de bœuf', FALSE, 1),
(1, 'Fromage cheddar aged', TRUE, 2),
(1, 'Salade iceberg', TRUE, 3),
(1, 'Tomate', TRUE, 4),
(1, 'Oignons caramélisés', TRUE, 5),
(1, 'Sauce Block B', TRUE, 6),
-- BBQ Smoker
(2, 'Steak de bœuf', FALSE, 1),
(2, 'Bacon fumé', TRUE, 2),
(2, 'Fromage cheddar', TRUE, 3),
(2, 'Oignons frits', TRUE, 4),
(2, 'Sauce BBQ', TRUE, 5),
-- Veggie Street
(3, 'Steak végétarien', FALSE, 1),
(3, 'Avocat', TRUE, 2),
(3, 'Roquette', TRUE, 3),
(3, 'Tomate', TRUE, 4),
(3, 'Oignons rouges', TRUE, 5),
(3, 'Sauce tahini', TRUE, 6);

-- Créneaux horaires par défaut (exemple pour les 7 prochains jours)
-- À adapter selon vos horaires d'ouverture
INSERT OR IGNORE INTO time_slots (date, time) VALUES
-- Exemple pour aujourd'hui + 7 jours (à adapter)
('2024-01-15', '11:30'), ('2024-01-15', '12:00'), ('2024-01-15', '12:30'),
('2024-01-15', '18:30'), ('2024-01-15', '19:00'), ('2024-01-15', '19:30'),
('2024-01-16', '11:30'), ('2024-01-16', '12:00'), ('2024-01-16', '12:30'),
('2024-01-16', '18:30'), ('2024-01-16', '19:00'), ('2024-01-16', '19:30');

PRAGMA foreign_keys = ON;
`;

console.log('🍔 Migration SQL pour D1 générée');
console.log('📋 Copiez cette commande pour exécuter la migration :');
console.log('');
console.log('wrangler d1 execute burgerdb --file=./scripts/d1-migration.sql');
console.log('');
console.log('💾 Fichier SQL sauvegardé dans : scripts/d1-migration.sql');

// Sauvegarder le SQL dans un fichier
import { writeFileSync } from 'fs';
writeFileSync('./scripts/d1-migration.sql', MIGRATION_SQL);
