# 🚀 Guide de Déploiement Cloudflare Pages

Ce guide détaille le déploiement de l'application Block B sur Cloudflare Pages avec vos ressources existantes.

## 📋 Prérequis

Vous avez déjà créé :
- ✅ **Base de données D1** : `burgerdb`
- ✅ **Compartiment R2** : `burgerfiles`
- ✅ **URL publique R2** : `https://pub-e60d9d89a38b4236976356ca78e829f8.r2.dev`

## 🏗️ Étapes de Déploiement

### 1. Migration de la Base de Données D1

Exécutez la migration depuis votre terminal local :

```bash
# Installer Wrangler si ce n'est pas fait
npm install -g wrangler

# Se connecter à Cloudflare
wrangler login

# Exécuter la migration D1
wrangler d1 execute burgerdb --file=./scripts/d1-migration.sql
```

### 2. Configuration Cloudflare Pages

#### A. Créer le Projet Pages

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Sélectionnez votre compte
3. Dans le menu latéral, cliquez sur **Pages**
4. Cliquez sur **Create a project**
5. Choisissez **Connect to Git**
6. Sélectionnez votre repository GitHub : `JackHouche/burger`

#### B. Configuration du Build

- **Framework preset** : Next.js (Static HTML Export)
- **Build command** : `npm run build`
- **Build output directory** : `out`
- **Root directory** : `/` (racine)

### 3. Variables d'Environnement

Dans les paramètres de votre projet Pages, ajoutez ces variables :

#### Variables de Production
```
NODE_ENV=production
NEXTAUTH_URL=https://votre-domaine.pages.dev
NEXTAUTH_SECRET=votre-secret-nextauth-32-chars-min
DATABASE_ID=burgerdb
CLOUDFLARE_ACCOUNT_ID=votre-account-id
R2_BUCKET_NAME=burgerfiles
R2_PUBLIC_URL=https://pub-e60d9d89a38b4236976356ca78e829f8.r2.dev
```

#### Clés R2 (depuis Dashboard R2)
```
R2_ACCESS_KEY_ID=votre-access-key-id
R2_SECRET_ACCESS_KEY=votre-secret-access-key
```

#### Configuration Stripe
```
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete
STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
```

### 4. Liaisons (Bindings)

Dans l'onglet **Settings** > **Functions** de votre projet Pages :

#### D1 Database Binding
- **Variable name** : `DB`
- **D1 database** : `burgerdb`

#### R2 Bucket Binding
- **Variable name** : `IMAGES`
- **R2 bucket** : `burgerfiles`

### 5. Configuration des Domaines

1. Dans **Custom domains**, ajoutez votre domaine
2. Mettez à jour `NEXTAUTH_URL` avec votre domaine final
3. Redéployez le projet

### 6. Configuration Stripe

#### A. Webhooks
1. Dans votre dashboard Stripe, allez dans **Developers** > **Webhooks**
2. Ajoutez un endpoint : `https://votre-domaine.pages.dev/api/stripe/webhook`
3. Événements à écouter :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

#### B. Clés de Production
Remplacez les clés de test par vos clés de production dans les variables d'environnement.

## 🔧 Commandes Utiles

### Tester la Migration D1
```bash
# Lister les tables
wrangler d1 execute burgerdb --command="SELECT name FROM sqlite_master WHERE type='table';"

# Vérifier les produits
wrangler d1 execute burgerdb --command="SELECT * FROM products LIMIT 5;"

# Vérifier les créneaux
wrangler d1 execute burgerdb --command="SELECT * FROM time_slots LIMIT 10;"
```

### Logs de Production
```bash
# Voir les logs des fonctions
wrangler pages deployment tail --project-name=burger
```

## 🔐 Sécurité

### Génération du Secret NextAuth
```bash
# Générer un secret sécurisé
openssl rand -base64 32
```

### Variables Sensibles
- ❌ **Jamais** committer les clés Stripe ou autres secrets
- ✅ Toujours utiliser les variables d'environnement Cloudflare
- ✅ Utiliser les clés de production Stripe pour le live

## 🧪 Test du Déploiement

### Vérifications Post-Déploiement

1. **Page d'accueil** : Vérifiez que le menu Block B s'affiche
2. **Base de données** : Testez l'ajout au panier
3. **Images** : Uploadez une image de produit (si admin)
4. **Paiements** : Testez une commande avec Stripe
5. **Créneaux** : Vérifiez la sélection de créneaux

### URLs de Test
- **Frontend** : `https://votre-domaine.pages.dev`
- **API Health** : `https://votre-domaine.pages.dev/api/products`
- **Admin** : `https://votre-domaine.pages.dev/admin/login`
- **Cuisine** : `https://votre-domaine.pages.dev/kitchen`

## 🚨 Dépannage

### Erreur "Database not found"
- Vérifiez que la liaison D1 `DB` est configurée
- Vérifiez que `DATABASE_ID=burgerdb` est défini

### Erreur Upload Image
- Vérifiez les clés R2 dans les variables d'environnement
- Vérifiez que la liaison R2 `IMAGES` est configurée

### Erreur Stripe
- Vérifiez les clés Stripe (live vs test)
- Vérifiez que le webhook est configuré avec la bonne URL

## 📈 Optimisations

### Performance
- Les images sont servies depuis R2 avec CDN
- D1 est optimisé avec des index
- Next.js est configuré pour l'export statique

### Monitoring
- Utilisez Cloudflare Analytics
- Surveillez les logs des fonctions
- Configurez des alertes sur les erreurs

## 🎯 Post-Déploiement

### Mise à Jour du README
Mettez à jour l'URL de production dans le README principal.

### Sauvegarde
- Sauvegardez régulièrement D1 avec `wrangler d1 export`
- Documentez les changements de schéma

### Maintenance
- Surveillez les logs d'erreur
- Mettez à jour les créneaux horaires régulièrement
- Gérez les commandes via l'interface admin

---

🍔 **Block B est maintenant prêt pour la production !**

Pour toute question technique, consultez la [documentation Cloudflare Pages](https://developers.cloudflare.com/pages/) et [D1](https://developers.cloudflare.com/d1/).