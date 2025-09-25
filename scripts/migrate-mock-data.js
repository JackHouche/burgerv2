#!/usr/bin/env node

/**
 * Script de migration pour peupler la base de données D1 avec les données mockées
 * Utilisation: node scripts/migrate-mock-data.js
 */

const mockProducts = [
  {
    name: "Block B Signature",
    description: "Notre burger emblématique avec steak de bœuf, fromage aged cheddar, salade, tomate, oignons caramélisés et sauce Block B spéciale",
    price: 12.0,
    category: "burger",
    ingredients: [
      { name: "Steak de bœuf", isRemovable: false, sortOrder: 1 },
      { name: "Fromage cheddar aged", isRemovable: true, sortOrder: 2 },
      { name: "Salade iceberg", isRemovable: true, sortOrder: 3 },
      { name: "Tomate", isRemovable: true, sortOrder: 4 },
      { name: "Oignons caramélisés", isRemovable: true, sortOrder: 5 },
      { name: "Sauce Block B", isRemovable: true, sortOrder: 6 },
    ],
  },
  {
    name: "BBQ Smoker",
    description: "Steak de bœuf grillé, bacon fumé, fromage cheddar, oignons frits, sauce BBQ maison",
    price: 13.5,
    category: "burger",
    ingredients: [
      { name: "Steak de bœuf", isRemovable: false, sortOrder: 1 },
      { name: "Bacon fumé", isRemovable: true, sortOrder: 2 },
      { name: "Fromage cheddar", isRemovable: true, sortOrder: 3 },
      { name: "Oignons frits", isRemovable: true, sortOrder: 4 },
      { name: "Sauce BBQ", isRemovable: true, sortOrder: 5 },
    ],
  },
  {
    name: "Veggie Street",
    description: "Steak végétarien maison, avocat, roquette, tomate, oignons rouges, sauce tahini",
    price: 11.0,
    category: "burger",
    ingredients: [
      { name: "Steak végétarien", isRemovable: false, sortOrder: 1 },
      { name: "Avocat", isRemovable: true, sortOrder: 2 },
      { name: "Roquette", isRemovable: true, sortOrder: 3 },
      { name: "Tomate", isRemovable: true, sortOrder: 4 },
      { name: "Oignons rouges", isRemovable: true, sortOrder: 5 },
      { name: "Sauce tahini", isRemovable: true, sortOrder: 6 },
    ],
  },
  {
    name: "Frites Block B",
    description: "Frites maison coupées à la main, assaisonnement secret Block B",
    price: 4.5,
    category: "side",
    ingredients: [],
  },
  {
    name: "Onion Rings",
    description: "Rondelles d'oignons panées maison, sauce ranch",
    price: 5.5,
    category: "side",
    ingredients: [],
  },
  {
    name: "Cola Artisanal",
    description: "Cola fait maison aux épices naturelles",
    price: 3.5,
    category: "drink",
    ingredients: [],
  },
  {
    name: "Brownie Block B",
    description: "Brownie au chocolat noir, glace vanille, sauce caramel",
    price: 6.5,
    category: "dessert",
    ingredients: [],
  },
];

async function migrateProducts() {
  console.log("🔄 Migration des produits mockés vers D1...");

  try {
    for (const product of mockProducts) {
      console.log(`📦 Ajout du produit: ${product.name}`);

      const response = await fetch(`http://localhost:3000/api/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const createdProduct = await response.json();
        console.log(`✅ Produit créé: ${createdProduct.name} (ID: ${createdProduct.id})`);
      } else {
        const error = await response.text();
        console.error(`❌ Erreur pour ${product.name}:`, error);
      }
    }

    console.log("✅ Migration terminée!");
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
  }
}

// Instructions pour l'utilisateur
console.log(`
🚀 Script de migration des données mockées

Instructions:
1. Assurez-vous que votre serveur de développement est démarré (npm run dev)
2. Assurez-vous que Cloudflare D1 est configuré correctement
3. Exécutez ce script: node scripts/migrate-mock-data.js

Appuyez sur Entrée pour continuer ou Ctrl+C pour annuler...
`);

// Attendre la confirmation de l'utilisateur
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', () => {
  migrateProducts();
});
