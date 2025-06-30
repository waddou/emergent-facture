# 🗄️ Base de Données - Système de Facturation

## 📋 Vue d'ensemble

Ce document décrit l'architecture et l'installation de la base de données MongoDB pour le système de facturation français.

## 🏗️ Architecture

### **Collections Principales**
- `users` - Utilisateurs du système
- `clients` - Clients de facturation
- `articles` - Produits et services
- `invoices` - Factures émises
- `quotes` - Devis
- `credit_notes` - Avoirs/remboursements
- `purchase_invoices` - Factures d'achat/dépenses
- `expense_reports` - Notes de frais
- `settings` - Paramètres utilisateur

## 🚀 Installation

### **Prérequis**
- MongoDB 4.4+ installé et fonctionnel
- Node.js 16+ avec npm/yarn
- Accès en écriture à la base de données

### **Installation automatique**

```bash
# 1. Installer les dépendances (si nécessaire)
npm install mongodb

# 2. Configurer l'URL MongoDB (optionnel)
export MONGO_URL="mongodb://localhost:27017/facturation"

# 3. Exécuter le script d'installation
node install_database.js
```

### **Installation manuelle**

```bash
# 1. Se connecter à MongoDB
mongo

# 2. Sélectionner la base de données
use facturation

# 3. Importer les données (si mongoimport est disponible)
mongoimport --db facturation --collection users --file database_export.json --jsonArray
```

## 📊 Données de Test

### **Utilisateur de test**
- **Email**: `vivearoua@gmail.com`
- **Entreprise**: Digital Solutions SARL
- **SIRET**: 12345678901234

### **Clients de test**
1. **ABC SARL** - Client privilégié (15 factures, 12 450€)
2. **XYZ Consulting** - Spécialiste transformation digitale (8 factures, 8 920€)
3. **Tech Solutions** - Startup en croissance (22 factures, 18 670€)
4. **Sophie Leroy** - Freelance graphiste (3 factures, 1 250€)

### **Articles/Services**
1. **Développement Web** - 75€/heure
2. **Consultation IT** - 120€/heure
3. **Formation React** - 450€/jour
4. **Audit SEO** - 950€/forfait
5. **Maintenance Web** - 150€/mois

### **Données existantes**
- ✅ **3 factures** avec différents statuts (payée, envoyée, en retard)
- ✅ **2 devis** (accepté, envoyé)
- ✅ **1 avoir** (remise commerciale)
- ✅ **2 factures d'achat** (OVH, Adobe)
- ✅ **2 notes de frais** (déplacement, repas d'affaires)

## 🔧 Configuration

### **Variables d'environnement**

```bash
# URL de connexion MongoDB
MONGO_URL=mongodb://localhost:27017/facturation

# Base de données par défaut
DATABASE_NAME=facturation
```

### **Index de performance**

Le script d'installation crée automatiquement tous les index nécessaires :

- **Recherche rapide** par email, numéros de facture/devis
- **Filtrage efficace** par statut, date, client
- **Tri optimisé** pour les listes
- **Contraintes d'unicité** sur les champs critiques

## 📈 Statistiques

Une fois installée, la base contient :

```
📊 Collections:
   - users: 1 document
   - clients: 4 documents  
   - articles: 5 documents
   - invoices: 3 documents
   - quotes: 2 documents
   - credit_notes: 1 document
   - purchase_invoices: 2 documents
   - expense_reports: 2 documents
   - settings: 1 document

💰 Données financières:
   - Chiffre d'affaires total: ~41 290€
   - Factures en attente: 3 816€
   - Factures payées: 1 890€
   - Devis en cours: 3 390€
```

## 🔄 Maintenance

### **Sauvegarde**

```bash
# Sauvegarde complète
mongodump --db facturation --out backup/

# Export JSON pour migration
mongoexport --db facturation --collection invoices --out invoices_backup.json
```

### **Restauration**

```bash
# Restauration complète
mongorestore --db facturation backup/facturation/

# Re-création des index
node install_database.js
```

### **Nettoyage**

```bash
# Supprimer toutes les données de test
mongo facturation --eval "db.dropDatabase()"

# Réinstaller depuis zéro
node install_database.js
```

## 🔍 Requêtes Utiles

### **Statistiques rapides**

```javascript
// Nombre total de factures par statut
db.invoices.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// Chiffre d'affaires par mois
db.invoices.aggregate([
  { $match: { status: "paid" } },
  { $group: { 
    _id: { $dateToString: { format: "%Y-%m", date: "$invoiceDate" } },
    total: { $sum: "$totals.grandTotal" }
  }}
])

// Top 5 clients par montant
db.clients.find({}).sort({ "stats.totalAmount": -1 }).limit(5)
```

### **Recherche avancée**

```javascript
// Factures en retard
db.invoices.find({
  status: { $nin: ["paid", "cancelled"] },
  dueDate: { $lt: new Date() }
})

// Devis convertis en factures
db.quotes.find({
  "convertedToInvoice": { $exists: true }
})
```

## 🛡️ Sécurité

### **Bonnes pratiques**
- ✅ Mots de passe hashés avec bcrypt
- ✅ Index d'unicité sur les emails
- ✅ Validation des ObjectId pour les références
- ✅ Isolation des données par userId

### **Permissions recommandées**
```javascript
// Utilisateur application (lecture/écriture sur facturation)
db.createUser({
  user: "facturation_app",
  pwd: "secure_password_here",
  roles: [
    { role: "readWrite", db: "facturation" }
  ]
})
```

## 📞 Support

Pour toute question sur la base de données :
1. Vérifier les logs MongoDB
2. Consulter le schéma dans `database_schema.md`
3. Tester avec les requêtes d'exemple ci-dessus

---

💡 **Conseil**: Exécuter `node install_database.js` après chaque mise à jour du schéma pour maintenir la cohérence.