#!/usr/bin/env node

/**
 * Script d'installation de la base de données MongoDB
 * pour le système de facturation
 * 
 * Usage: node install_database.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Configuration MongoDB
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/facturation';
const DATABASE_NAME = 'facturation';

// Couleurs pour l'affichage console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function createIndexes(db) {
  log('\n📊 Création des index...', 'yellow');

  try {
    // Index pour users
    await db.collection('users').createIndex({ "email": 1 }, { unique: true });
    log('✅ Index users créé', 'green');

    // Index pour clients
    await db.collection('clients').createIndex({ "userId": 1 });
    await db.collection('clients').createIndex({ "userId": 1, "clientNumber": 1 }, { unique: true });
    await db.collection('clients').createIndex({ "userId": 1, "email": 1 });
    log('✅ Index clients créés', 'green');

    // Index pour articles
    await db.collection('articles').createIndex({ "userId": 1 });
    await db.collection('articles').createIndex({ "userId": 1, "articleNumber": 1 }, { unique: true });
    log('✅ Index articles créés', 'green');

    // Index pour factures
    await db.collection('invoices').createIndex({ "userId": 1 });
    await db.collection('invoices').createIndex({ "userId": 1, "invoiceNumber": 1 }, { unique: true });
    await db.collection('invoices').createIndex({ "userId": 1, "clientId": 1 });
    await db.collection('invoices').createIndex({ "userId": 1, "status": 1 });
    await db.collection('invoices').createIndex({ "userId": 1, "invoiceDate": -1 });
    await db.collection('invoices').createIndex({ "userId": 1, "dueDate": 1 });
    log('✅ Index factures créés', 'green');

    // Index pour devis
    await db.collection('quotes').createIndex({ "userId": 1 });
    await db.collection('quotes').createIndex({ "userId": 1, "quoteNumber": 1 }, { unique: true });
    await db.collection('quotes').createIndex({ "userId": 1, "clientId": 1 });
    await db.collection('quotes').createIndex({ "userId": 1, "status": 1 });
    await db.collection('quotes').createIndex({ "userId": 1, "quoteDate": -1 });
    log('✅ Index devis créés', 'green');

    // Index pour avoirs
    await db.collection('credit_notes').createIndex({ "userId": 1 });
    await db.collection('credit_notes').createIndex({ "userId": 1, "invoiceId": 1 });
    log('✅ Index avoirs créés', 'green');

    // Index pour factures d'achat
    await db.collection('purchase_invoices').createIndex({ "userId": 1 });
    await db.collection('purchase_invoices').createIndex({ "userId": 1, "invoiceDate": -1 });
    log('✅ Index factures d\'achat créés', 'green');

    // Index pour notes de frais
    await db.collection('expense_reports').createIndex({ "userId": 1 });
    await db.collection('expense_reports').createIndex({ "userId": 1, "date": -1 });
    log('✅ Index notes de frais créés', 'green');

    // Index pour paramètres
    await db.collection('settings').createIndex({ "userId": 1 }, { unique: true });
    log('✅ Index paramètres créé', 'green');

  } catch (error) {
    log(`❌ Erreur lors de la création des index: ${error.message}`, 'red');
    throw error;
  }
}

async function importData(db) {
  log('\n📥 Import des données de test...', 'yellow');

  try {
    // Lire le fichier d'export
    const exportPath = path.join(__dirname, 'database_export.json');
    const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

    for (const collectionData of exportData) {
      const { collection, data } = collectionData;
      
      if (data && data.length > 0) {
        // Vider la collection existante
        await db.collection(collection).deleteMany({});
        
        // Insérer les nouvelles données
        await db.collection(collection).insertMany(data);
        log(`✅ Collection '${collection}': ${data.length} documents importés`, 'green');
      }
    }

  } catch (error) {
    log(`❌ Erreur lors de l'import des données: ${error.message}`, 'red');
    throw error;
  }
}

async function validateData(db) {
  log('\n🔍 Validation des données...', 'yellow');

  try {
    // Compter les documents dans chaque collection
    const collections = ['users', 'clients', 'articles', 'invoices', 'quotes', 
                        'credit_notes', 'purchase_invoices', 'expense_reports', 'settings'];
    
    for (const collection of collections) {
      const count = await db.collection(collection).countDocuments();
      log(`📋 ${collection}: ${count} documents`, 'cyan');
    }

    // Vérifier la cohérence des références
    const users = await db.collection('users').find({}).toArray();
    log(`\n👤 Utilisateurs trouvés: ${users.length}`, 'blue');

    for (const user of users) {
      const clientCount = await db.collection('clients').countDocuments({ userId: user._id });
      const invoiceCount = await db.collection('invoices').countDocuments({ userId: user._id });
      const quoteCount = await db.collection('quotes').countDocuments({ userId: user._id });
      
      log(`   - ${user.email}: ${clientCount} clients, ${invoiceCount} factures, ${quoteCount} devis`, 'cyan');
    }

  } catch (error) {
    log(`❌ Erreur lors de la validation: ${error.message}`, 'red');
    throw error;
  }
}

async function main() {
  log('🚀 Installation de la base de données - Système de Facturation', 'magenta');
  log('=' .repeat(60), 'magenta');

  let client;

  try {
    // Connexion à MongoDB
    log('\n📡 Connexion à MongoDB...', 'yellow');
    client = new MongoClient(MONGO_URL);
    await client.connect();
    
    const db = client.db(DATABASE_NAME);
    log(`✅ Connecté à la base de données: ${DATABASE_NAME}`, 'green');

    // Créer les index
    await createIndexes(db);

    // Importer les données
    await importData(db);

    // Valider les données
    await validateData(db);

    log('\n🎉 Installation terminée avec succès !', 'green');
    log('=' .repeat(60), 'green');
    log('\n📝 Informations de connexion:', 'blue');
    log(`   Database: ${DATABASE_NAME}`, 'cyan');
    log(`   URL: ${MONGO_URL}`, 'cyan');
    log('\n🔑 Compte de test:', 'blue');
    log('   Email: vivearoua@gmail.com', 'cyan');
    log('   Mot de passe: [hash bcrypt dans la DB]', 'cyan');
    log('\n📊 Données disponibles:', 'blue');
    log('   - 4 clients de test', 'cyan');
    log('   - 5 articles/services', 'cyan');
    log('   - 3 factures (avec différents statuts)', 'cyan');
    log('   - 2 devis', 'cyan');
    log('   - 1 avoir', 'cyan');
    log('   - 2 factures d\'achat', 'cyan');
    log('   - 2 notes de frais', 'cyan');

  } catch (error) {
    log(`\n💥 Erreur critique: ${error.message}`, 'red');
    process.exit(1);

  } finally {
    if (client) {
      await client.close();
      log('\n🔌 Connexion fermée', 'yellow');
    }
  }
}

// Point d'entrée
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };