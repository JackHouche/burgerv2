#!/usr/bin/env node

/**
 * Script pour peupler la base de données D1 avec des produits de démonstration
 * Usage: node scripts/seed-database.mjs
 * Nécessite que le serveur soit démarré sur localhost:3000
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

async function seedDatabase() {
  console.log("🌱 Peuplement de la base de données avec des produits de démonstration...\n");

  let success = 0;
  let errors = 0;

  for (const product of mockProducts) {
    try {
      console.log(`📦 Ajout: ${product.name}`);

      const response = await fetch("http://localhost:3000/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Créé avec l'ID ${result.id}`);
        success++;
      } else {
        const errorText = await response.text();
        console.log(`   ❌ Erreur: ${errorText}`);
        errors++;
      }
    } catch (error) {
      console.log(`   ❌ Erreur réseau: ${error.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Résumé:`);
  console.log(`   ✅ Produits créés: ${success}`);
  console.log(`   ❌ Erreurs: ${errors}`);

  if (errors === 0) {
    console.log("\n🎉 Base de données peuplée avec succès!");
    console.log("Vous pouvez maintenant gérer vos produits via l'interface admin.");
  } else {
    console.log("\n⚠️ Certains produits n'ont pas pu être créés. Vérifiez les erreurs ci-dessus.");
  }
}

// Vérifier si le serveur est accessible
async function checkServer() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    if (response.ok) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

// Point d'entrée
async function main() {
  console.log("🔍 Vérification de la disponibilité du serveur...");

  const serverUp = await checkServer();
  if (!serverUp) {
    console.log(`
❌ Le serveur n'est pas accessible sur http://localhost:3000

Assurez-vous que:
1. Le serveur de développement est démarré (npm run dev)
2. Il écoute sur le port 3000
3. Cloudflare D1 est correctement configuré

Puis relancez ce script.
    `);
    process.exit(1);
  }

  console.log("✅ Serveur accessible\n");
  await seedDatabase();
}

main().catch(console.error);
