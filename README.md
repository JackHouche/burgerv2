# 🍔 Click & Collect Restaurant

Une application web complète de commande en ligne Click & Collect pour restaurant, développée avec Next.js 14+ et optimisée pour les appareils mobiles.

## 🎯 Fonctionnalités

### Interface Client (Mobile-First)
- 📱 **Design responsive** - Optimisé pour mobile avec interface tactile
- 🍔 **Menu interactif** - Catalogue produits avec catégories et filtres
- 🛒 **Panier persistant** - Système de panier avec localStorage (Zustand)
- ⏰ **Réservation de créneaux** - Sélection de créneaux horaires disponibles
- 🎨 **Personnalisation** - Possibilité de retirer des ingrédients
- 💳 **Paiement sécurisé** - Intégration Stripe Checkout
- ✅ **Confirmation** - Page de confirmation avec numéro de commande

### Interface Administration
- 🔐 **Authentification sécurisée** - NextAuth.js avec JWT
- 📊 **Dashboard** - Statistiques et aperçu des commandes
- 📦 **Gestion produits** - CRUD complet avec upload d'images (R2)
- 👥 **Gestion utilisateurs** - Rôles admin/cuisine
- ⚙️ **Configuration** - Horaires et paramètres restaurant

### Interface Cuisine (Temps Réel)
- 🔔 **Commandes en temps réel** - Mise à jour automatique toutes les 30s
- 📋 **Filtres par statut** - Nouvelles, en préparation, prêtes
- 🎯 **Actions rapides** - Changement de statut en un clic
- 📝 **Détails complets** - Ingrédients, personnalisations, notes

## 🛠️ Stack Technique

- **Framework**: Next.js 14+ (App Router)
- **Base de données**: SQLite (Better SQLite3) + Drizzle ORM
- **Authentification**: NextAuth.js
- **Paiements**: Stripe
- **UI**: Tailwind CSS + Lucide React
- **État global**: Zustand
- **Validation**: Zod
- **Déploiement**: Cloudflare Pages (D1 + R2)

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
cd burger

# Installer les dépendances
npm install

# Configurer la base de données
npm run setup-db

# Démarrer en mode développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000` (ou 3001 si le port 3000 est occupé).

### Variables d'environnement

Copiez le fichier `.env.local` et configurez vos clés :

```env
# Base de données
DATABASE_URL="file:./dev.db"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# NextAuth
NEXTAUTH_SECRET="your-very-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# Cloudflare R2 (optionnel en développement)
CLOUDFLARE_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="product-images"
```

## 🎭 Comptes de démonstration

La base de données est initialisée avec des comptes de test :

- **Admin**: `admin@demo.com` / `password123`
- **Cuisine**: `kitchen@demo.com` / `password123`

## 📱 Structure du Projet

```
/burger/
├── /app/                        # Next.js App Router
│   ├── /(public)/               # Routes publiques
│   │   ├── page.tsx             # Menu principal
│   │   ├── /checkout/           # Panier et commande
│   │   └── /order/[sessionId]/  # Confirmation
│   ├── /admin/                  # Administration
│   │   ├── /login/              # Connexion
│   │   ├── /dashboard/          # Tableau de bord
│   │   └── /products/           # Gestion produits
│   ├── /kitchen/                # Interface cuisine
│   └── /api/                    # API Routes
├── /components/                 # Composants React
│   ├── /ui/                     # Composants UI
│   ├── /cart/                   # Composants panier
│   └── /products/               # Composants produits
├── /lib/                        # Utilitaires
│   ├── /db/                     # Database & ORM
│   ├── /r2/                     # Cloudflare R2
│   └── stripe.ts                # Configuration Stripe
├── /hooks/                      # Custom hooks
├── /types/                      # Types TypeScript
└── /scripts/                    # Scripts utilitaires
```

## 📊 Base de Données

### Tables principales
- `products` - Produits du menu
- `ingredients` - Ingrédients des produits
- `orders` - Commandes clients
- `order_items` - Articles des commandes
- `time_slots` - Créneaux horaires
- `admin_users` - Utilisateurs admin
- `restaurant_config` - Configuration

### Scripts utiles
```bash
# Réinitialiser la base de données
npm run setup-db

# Créer une migration
npm run db:generate

# Appliquer les migrations
npm run db:migrate
```

## 🕐 Configuration Horaires

Les horaires d'ouverture sont configurés dans `lib/constants.ts` :

```typescript
const RESTAURANT_HOURS = {
  monday: { closed: true },
  tuesday: { 
    lunch: null,
    dinner: { open: '18:00', close: '21:30' }
  },
  // ... autres jours
};
```

## 🔧 Scripts NPM

```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Démarrer en production
npm run setup-db     # Initialiser la base de données
npm run db:migrate   # Appliquer les migrations
npm run init-db      # Peupler avec des données de test
```

## 🚀 Déploiement Cloudflare

### Configuration D1 (Base de données)
```bash
# Créer la base D1
wrangler d1 create click-collect-db

# Appliquer les migrations
wrangler d1 migrations apply click-collect-db
```

### Configuration R2 (Images)
```bash
# Créer le bucket R2
wrangler r2 bucket create product-images
```

### Variables d'environnement
Configurez les variables dans le dashboard Cloudflare Pages :
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` 
- `NEXTAUTH_SECRET`
- etc.

## 🎨 Personnalisation

### Couleurs
Le thème utilise la couleur orange comme couleur principale. Modifiez dans `tailwind.config.js` :

```js
colors: {
  orange: {
    50: '#fff7ed',
    600: '#ea580c', // Couleur principale
    // ...
  }
}
```

### Logo et branding
- Remplacez les logos dans `/public/`
- Modifiez le nom dans `lib/constants.ts`
- Ajustez les métadonnées dans `app/layout.tsx`

## 📝 API Reference

### Endpoints principaux

#### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/[id]` - Détail d'un produit
- `POST /api/admin/products` - Créer un produit (auth)
- `PUT /api/admin/products/[id]` - Modifier un produit (auth)
- `DELETE /api/admin/products/[id]` - Supprimer un produit (auth)

#### Créneaux
- `GET /api/slots` - Créneaux disponibles
- `POST /api/slots` - Réserver un créneau

#### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/[id]` - Détail d'une commande
- `GET /api/admin/orders` - Liste des commandes (auth)
- `PATCH /api/admin/orders/[id]` - Modifier le statut (auth)

#### Stripe
- `POST /api/stripe/checkout` - Créer une session de paiement
- `POST /api/stripe/webhook` - Webhook Stripe

## 🔒 Sécurité

- **Authentification** - JWT sécurisé avec NextAuth.js
- **Validation** - Validation des données avec Zod
- **CORS** - Configuration appropriée pour la production
- **Variables d'environnement** - Secrets protégés
- **Hachage des mots de passe** - bcryptjs

## 📈 Performance

- **ISR** - Regeneration statique incrémentale
- **Images optimisées** - Next/Image avec lazy loading
- **Bundle splitting** - Optimisation automatique
- **Cache CDN** - Cloudflare pour les assets statiques

## 🐛 Dépannage

### Problèmes courants

**Port déjà utilisé**
```bash
# L'application utilise automatiquement le port suivant disponible
npm run dev
```

**Erreur de base de données**
```bash
# Réinitialiser la base de données
rm dev.db
npm run setup-db
```

**Erreurs Stripe en développement**
```bash
# Utiliser les clés de test Stripe
# Configurer les webhooks avec ngrok ou similaire
```

## 📄 Licence

Ce projet est fourni à des fins éducatives et de démonstration.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

---

**Développé avec ❤️ et Next.js**