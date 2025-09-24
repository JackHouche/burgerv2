// Cloudflare Pages Function pour les produits
export async function onRequestGet(context) {
  const { request } = context;

  try {
    // Données temporaires Block B pour tester
    const productsData = [
      {
        id: 1,
        name: "Block B Signature",
        description:
          "Notre burger emblématique avec steak de bœuf, fromage aged cheddar, salade, tomate, oignons caramélisés et sauce Block B spéciale",
        price: 1200,
        category: "burger",
        imageUrl: null,
        isAvailable: true,
        ingredients: [
          { id: 1, name: "Steak de bœuf", isRemovable: false, sortOrder: 1 },
          {
            id: 2,
            name: "Fromage cheddar aged",
            isRemovable: true,
            sortOrder: 2,
          },
          { id: 3, name: "Salade iceberg", isRemovable: true, sortOrder: 3 },
          { id: 4, name: "Tomate", isRemovable: true, sortOrder: 4 },
          {
            id: 5,
            name: "Oignons caramélisés",
            isRemovable: true,
            sortOrder: 5,
          },
          { id: 6, name: "Sauce Block B", isRemovable: true, sortOrder: 6 },
        ],
      },
      {
        id: 2,
        name: "BBQ Smoker",
        description:
          "Steak de bœuf grillé, bacon fumé, fromage cheddar, oignons frits, sauce BBQ maison",
        price: 1350,
        category: "burger",
        imageUrl: null,
        isAvailable: true,
        ingredients: [
          { id: 7, name: "Steak de bœuf", isRemovable: false, sortOrder: 1 },
          { id: 8, name: "Bacon fumé", isRemovable: true, sortOrder: 2 },
          { id: 9, name: "Fromage cheddar", isRemovable: true, sortOrder: 3 },
          { id: 10, name: "Oignons frits", isRemovable: true, sortOrder: 4 },
          { id: 11, name: "Sauce BBQ", isRemovable: true, sortOrder: 5 },
        ],
      },
      {
        id: 3,
        name: "Veggie Street",
        description:
          "Steak végétarien maison, avocat, roquette, tomate, oignons rouges, sauce tahini",
        price: 1100,
        category: "burger",
        imageUrl: null,
        isAvailable: true,
        ingredients: [
          {
            id: 12,
            name: "Steak végétarien",
            isRemovable: false,
            sortOrder: 1,
          },
          { id: 13, name: "Avocat", isRemovable: true, sortOrder: 2 },
          { id: 14, name: "Roquette", isRemovable: true, sortOrder: 3 },
          { id: 15, name: "Tomate", isRemovable: true, sortOrder: 4 },
          { id: 16, name: "Oignons rouges", isRemovable: true, sortOrder: 5 },
          { id: 17, name: "Sauce tahini", isRemovable: true, sortOrder: 6 },
        ],
      },
      {
        id: 4,
        name: "Frites Block B",
        description:
          "Frites maison coupées à la main, assaisonnement secret Block B",
        price: 450,
        category: "side",
        imageUrl: null,
        isAvailable: true,
        ingredients: [],
      },
      {
        id: 5,
        name: "Onion Rings",
        description: "Rondelles d'oignons panées maison, sauce ranch",
        price: 550,
        category: "side",
        imageUrl: null,
        isAvailable: true,
        ingredients: [],
      },
      {
        id: 6,
        name: "Cola Artisanal",
        description: "Cola fait maison aux épices naturelles",
        price: 350,
        category: "drink",
        imageUrl: null,
        isAvailable: true,
        ingredients: [],
      },
      {
        id: 7,
        name: "Brownie Block B",
        description: "Brownie au chocolat noir, glace vanille, sauce caramel",
        price: 650,
        category: "dessert",
        imageUrl: null,
        isAvailable: true,
        ingredients: [],
      },
    ];

    return new Response(JSON.stringify(productsData), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error in products function:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch products",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
