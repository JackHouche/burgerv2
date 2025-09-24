import { getLocalDb } from '../lib/db/client';
import { products, ingredients, adminUsers, restaurantConfig } from '../lib/db/schema';
import bcrypt from 'bcryptjs';

async function initializeDatabase() {
  console.log('🗄️ Initialisation de la base de données...');

  try {
    const db = getLocalDb();

    // Créer un utilisateur admin par défaut
    console.log('👤 Création des utilisateurs admin...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    await db.insert(adminUsers).values([
      {
        email: 'admin@demo.com',
        name: 'Admin Demo',
        role: 'admin',
        passwordHash: hashedPassword,
        isActive: true
      },
      {
        email: 'kitchen@demo.com',
        name: 'Équipe Cuisine',
        role: 'kitchen',
        passwordHash: hashedPassword,
        isActive: true
      }
    ]);

    // Ajouter des produits de démonstration
    console.log('🍔 Ajout des produits...');

    // Burgers
    const [burger1] = await db.insert(products).values({
      name: 'Burger Classic',
      description: 'Le classique indémodable avec steak, salade, tomate, cornichons et notre sauce spéciale',
      price: 12.50,
      category: 'burger',
      isAvailable: true
    }).returning();

    const [burger2] = await db.insert(products).values({
      name: 'Burger BBQ',
      description: 'Steak grillé, sauce BBQ, bacon croustillant, oignons frits et cheddar',
      price: 14.90,
      category: 'burger',
      isAvailable: true
    }).returning();

    const [burger3] = await db.insert(products).values({
      name: 'Burger Végétarien',
      description: 'Galette végétale maison, avocat, tomate, salade et sauce tahini',
      price: 13.50,
      category: 'burger',
      isAvailable: true
    }).returning();

    // Accompagnements
    await db.insert(products).values([
      {
        name: 'Frites classiques',
        description: 'Pommes de terre fraîches coupées et frites à la perfection',
        price: 4.50,
        category: 'side',
        isAvailable: true
      },
      {
        name: 'Frites de patate douce',
        description: 'Frites de patate douce avec une pointe de paprika',
        price: 5.90,
        category: 'side',
        isAvailable: true
      },
      {
        name: 'Nuggets de poulet',
        description: '6 nuggets de poulet croustillants avec sauce au choix',
        price: 6.90,
        category: 'side',
        isAvailable: true
      },
      {
        name: 'Salade César',
        description: 'Salade romaine, croûtons, parmesan et sauce César maison',
        price: 8.50,
        category: 'side',
        isAvailable: true
      }
    ]);

    // Boissons
    await db.insert(products).values([
      {
        name: 'Coca-Cola',
        description: 'Canette 33cl',
        price: 2.50,
        category: 'drink',
        isAvailable: true
      },
      {
        name: 'Coca-Cola Zéro',
        description: 'Canette 33cl sans sucre',
        price: 2.50,
        category: 'drink',
        isAvailable: true
      },
      {
        name: 'Sprite',
        description: 'Canette 33cl',
        price: 2.50,
        category: 'drink',
        isAvailable: true
      },
      {
        name: 'Jus d\'orange',
        description: 'Jus d\'orange pressé 25cl',
        price: 3.50,
        category: 'drink',
        isAvailable: true
      },
      {
        name: 'Eau plate',
        description: 'Bouteille 50cl',
        price: 2.00,
        category: 'drink',
        isAvailable: true
      }
    ]);

    // Desserts
    await db.insert(products).values([
      {
        name: 'Cookie chocolat',
        description: 'Cookie moelleux aux pépites de chocolat noir',
        price: 3.50,
        category: 'dessert',
        isAvailable: true
      },
      {
        name: 'Muffin myrtilles',
        description: 'Muffin maison aux myrtilles fraîches',
        price: 4.20,
        category: 'dessert',
        isAvailable: true
      },
      {
        name: 'Tiramisu',
        description: 'Tiramisu traditionnel fait maison',
        price: 5.90,
        category: 'dessert',
        isAvailable: true
      }
    ]);

    // Ajouter les ingrédients pour les burgers
    console.log('🥬 Ajout des ingrédients...');

    await db.insert(ingredients).values([
      // Burger Classic
      { productId: burger1.id, name: 'Pain brioche', isRemovable: false, sortOrder: 1 },
      { productId: burger1.id, name: 'Steak de bœuf 120g', isRemovable: false, sortOrder: 2 },
      { productId: burger1.id, name: 'Salade iceberg', isRemovable: true, sortOrder: 3 },
      { productId: burger1.id, name: 'Tomate', isRemovable: true, sortOrder: 4 },
      { productId: burger1.id, name: 'Cornichons', isRemovable: true, sortOrder: 5 },
      { productId: burger1.id, name: 'Oignon', isRemovable: true, sortOrder: 6 },
      { productId: burger1.id, name: 'Sauce spéciale', isRemovable: true, sortOrder: 7 },

      // Burger BBQ
      { productId: burger2.id, name: 'Pain brioche', isRemovable: false, sortOrder: 1 },
      { productId: burger2.id, name: 'Steak de bœuf 120g', isRemovable: false, sortOrder: 2 },
      { productId: burger2.id, name: 'Bacon', isRemovable: true, sortOrder: 3 },
      { productId: burger2.id, name: 'Cheddar', isRemovable: true, sortOrder: 4 },
      { productId: burger2.id, name: 'Oignons frits', isRemovable: true, sortOrder: 5 },
      { productId: burger2.id, name: 'Sauce BBQ', isRemovable: true, sortOrder: 6 },

      // Burger Végétarien
      { productId: burger3.id, name: 'Pain complet', isRemovable: false, sortOrder: 1 },
      { productId: burger3.id, name: 'Galette végétale', isRemovable: false, sortOrder: 2 },
      { productId: burger3.id, name: 'Avocat', isRemovable: true, sortOrder: 3 },
      { productId: burger3.id, name: 'Tomate', isRemovable: true, sortOrder: 4 },
      { productId: burger3.id, name: 'Salade roquette', isRemovable: true, sortOrder: 5 },
      { productId: burger3.id, name: 'Sauce tahini', isRemovable: true, sortOrder: 6 }
    ]);

    // Configuration du restaurant
    console.log('⚙️ Configuration du restaurant...');
    await db.insert(restaurantConfig).values([
      { key: 'restaurant_name', value: 'Burger & Co' },
      { key: 'restaurant_phone', value: '01 23 45 67 89' },
      { key: 'restaurant_email', value: 'contact@burger-co.fr' },
      { key: 'restaurant_address', value: '123 Rue de la Gastronomie, 75001 Paris' }
    ]);

    console.log('✅ Base de données initialisée avec succès !');
    console.log('');
    console.log('👤 Comptes créés :');
    console.log('   Admin: admin@demo.com / password123');
    console.log('   Cuisine: kitchen@demo.com / password123');
    console.log('');
    console.log('🍔 Produits ajoutés : 15 produits dans 4 catégories');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase };
