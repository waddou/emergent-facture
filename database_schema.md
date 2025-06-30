# Schéma de Base de Données - Système de Facturation

## 🗄️ **Architecture MongoDB**

### **Collections Principales**

---

## 👤 **Collection: users**
```javascript
{
  _id: ObjectId("..."),
  email: "vivearoua@gmail.com",
  password: "hashed_password",
  profile: {
    firstName: "Viviane",
    lastName: "Aroua",
    company: "Mon Entreprise SARL",
    siret: "12345678901234",
    address: {
      street: "123 Rue de la République",
      city: "Paris",
      postalCode: "75001",
      country: "France"
    },
    phone: "+33 1 23 45 67 89",
    website: "www.mon-entreprise.fr"
  },
  settings: {
    currency: "EUR",
    language: "fr",
    timezone: "Europe/Paris",
    taxRate: 20.0,
    invoicePrefix: "F",
    quotePrefix: "D",
    nextInvoiceNumber: 1,
    nextQuoteNumber: 1
  },
  subscription: {
    plan: "free", // free, pro, enterprise
    startDate: ISODate("2025-01-01"),
    endDate: ISODate("2025-12-31"),
    features: ["invoicing", "quotes", "clients"]
  },
  createdAt: ISODate("2025-01-01T00:00:00Z"),
  updatedAt: ISODate("2025-06-30T00:00:00Z")
}
```

---

## 👥 **Collection: clients**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."), // Référence vers users
  clientNumber: "C001",
  type: "company", // "company" ou "individual"
  
  // Informations principales
  name: "ABC SARL",
  contactPerson: "Jean Dupont",
  email: "contact@abc-sarl.fr",
  phone: "01.23.45.67.89",
  website: "www.abc-sarl.fr",
  
  // Adresse
  address: {
    street: "123 Rue de la République",
    city: "Paris",
    postalCode: "75001",
    country: "France"
  },
  
  // Informations légales
  siret: "12345678901234",
  tva: "FR12345678901",
  codeAPE: "6201Z",
  
  // Paramètres commerciaux
  paymentTerms: 30, // jours
  defaultDiscount: 0, // pourcentage
  notes: "Client privilégié",
  
  // Statistiques
  stats: {
    totalInvoices: 15,
    totalAmount: 12450.00,
    lastInvoiceDate: ISODate("2025-06-25"),
    averagePaymentDelay: 25 // jours
  },
  
  // Métadonnées
  isActive: true,
  createdAt: ISODate("2025-01-15T00:00:00Z"),
  updatedAt: ISODate("2025-06-30T00:00:00Z")
}
```

---

## 📦 **Collection: articles**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  articleNumber: "ART001",
  
  // Informations produit
  name: "Développement Web",
  description: "Service de développement web sur mesure",
  category: "Services",
  
  // Tarification
  pricing: {
    unitPrice: 75.00,
    unit: "heure", // heure, jour, pièce, forfait
    currency: "EUR",
    taxRate: 20.0
  },
  
  // Stock (si applicable)
  inventory: {
    tracked: false,
    quantity: null,
    minQuantity: null
  },
  
  // Métadonnées
  isActive: true,
  createdAt: ISODate("2025-01-01T00:00:00Z"),
  updatedAt: ISODate("2025-06-30T00:00:00Z")
}
```

---

## 🧾 **Collection: invoices**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  clientId: ObjectId("..."),
  
  // Numérotation
  invoiceNumber: "F001",
  invoiceDate: ISODate("2025-06-15T00:00:00Z"),
  dueDate: ISODate("2025-07-15T00:00:00Z"),
  
  // Statut
  status: "paid", // draft, sent, paid, overdue, cancelled
  
  // Articles facturés
  items: [
    {
      articleId: ObjectId("..."),
      description: "Développement Web",
      quantity: 15,
      unitPrice: 75.00,
      totalHT: 1125.00,
      taxRate: 20.0,
      taxAmount: 225.00,
      totalTTC: 1350.00
    }
  ],
  
  // Totaux
  totals: {
    subtotalHT: 1125.00,
    totalTax: 225.00,
    totalTTC: 1350.00,
    discount: 0.00,
    grandTotal: 1350.00
  },
  
  // Paiement
  payment: {
    method: "virement", // virement, carte, especes, cheque
    reference: "VIR123456",
    paidDate: ISODate("2025-07-10T00:00:00Z"),
    paidAmount: 1350.00
  },
  
  // Informations client (snapshot)
  clientSnapshot: {
    name: "ABC SARL",
    address: {
      street: "123 Rue de la République",
      city: "Paris",
      postalCode: "75001",
      country: "France"
    },
    siret: "12345678901234"
  },
  
  // Paramètres
  currency: "EUR",
  language: "fr",
  notes: "Merci pour votre confiance",
  
  // Fichiers
  files: [
    {
      name: "facture_F001.pdf",
      url: "/uploads/invoices/facture_F001.pdf",
      size: 245678,
      uploadedAt: ISODate("2025-06-15T10:30:00Z")
    }
  ],
  
  // Métadonnées
  createdAt: ISODate("2025-06-15T00:00:00Z"),
  updatedAt: ISODate("2025-07-10T00:00:00Z")
}
```

---

## 📄 **Collection: quotes**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  clientId: ObjectId("..."),
  
  // Numérotation
  quoteNumber: "D001",
  quoteDate: ISODate("2025-06-28T00:00:00Z"),
  validUntil: ISODate("2025-07-28T00:00:00Z"),
  
  // Statut
  status: "accepted", // draft, sent, accepted, rejected, expired, converted
  
  // Articles
  items: [
    {
      articleId: ObjectId("..."),
      description: "Audit SEO",
      quantity: 1,
      unitPrice: 950.00,
      totalHT: 950.00,
      taxRate: 20.0,
      taxAmount: 190.00,
      totalTTC: 1140.00
    }
  ],
  
  // Totaux
  totals: {
    subtotalHT: 950.00,
    totalTax: 190.00,
    totalTTC: 1140.00,
    discount: 0.00,
    grandTotal: 1140.00
  },
  
  // Conversion
  convertedToInvoice: {
    invoiceId: ObjectId("..."),
    invoiceNumber: "F005",
    convertedAt: ISODate("2025-07-01T00:00:00Z")
  },
  
  // Informations client (snapshot)
  clientSnapshot: {
    name: "ABC SARL",
    address: {
      street: "123 Rue de la République",
      city: "Paris",
      postalCode: "75001",
      country: "France"
    }
  },
  
  // Paramètres
  currency: "EUR",
  language: "fr",
  notes: "Devis valable 30 jours",
  
  // Métadonnées
  createdAt: ISODate("2025-06-28T00:00:00Z"),
  updatedAt: ISODate("2025-07-01T00:00:00Z")
}
```

---

## ↩️ **Collection: credit_notes**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  clientId: ObjectId("..."),
  invoiceId: ObjectId("..."), // Facture d'origine
  
  // Numérotation
  creditNoteNumber: "AV001",
  creditNoteDate: ISODate("2025-06-20T00:00:00Z"),
  
  // Type
  type: "refund", // refund, discount, error_correction
  reason: "Remboursement partiel suite à un défaut",
  
  // Montant
  amount: 150.00,
  currency: "EUR",
  
  // Statut
  status: "issued", // draft, issued, applied
  
  // Métadonnées
  createdAt: ISODate("2025-06-20T00:00:00Z"),
  updatedAt: ISODate("2025-06-20T00:00:00Z")
}
```

---

## 🛒 **Collection: purchase_invoices**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  // Fournisseur
  supplier: {
    name: "Fournisseur Hébergement SAS",
    siret: "98765432101234",
    address: {
      street: "456 Avenue de la Tech",
      city: "Lyon",
      postalCode: "69001",
      country: "France"
    }
  },
  
  // Numérotation
  supplierInvoiceNumber: "FOURNISSEUR-2025-001",
  invoiceDate: ISODate("2025-06-01T00:00:00Z"),
  dueDate: ISODate("2025-07-01T00:00:00Z"),
  
  // Montant
  amount: 89.90,
  currency: "EUR",
  category: "hosting", // hosting, software, office, travel, etc.
  
  // Statut
  status: "paid", // pending, paid
  paidDate: ISODate("2025-06-05T00:00:00Z"),
  
  // Description
  description: "Hébergement web mensuel",
  notes: "Serveur de production",
  
  // Fichier
  attachments: [
    {
      filename: "facture_hebergement_juin.pdf",
      url: "/uploads/purchases/facture_hebergement_juin.pdf"
    }
  ],
  
  // Métadonnées
  createdAt: ISODate("2025-06-01T00:00:00Z"),
  updatedAt: ISODate("2025-06-05T00:00:00Z")
}
```

---

## 🧾 **Collection: expense_reports**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  // Informations
  title: "Déplacement client ABC SARL",
  date: ISODate("2025-06-15T00:00:00Z"),
  category: "travel", // travel, meals, office, communication, etc.
  
  // Montant
  amount: 45.60,
  currency: "EUR",
  
  // Détails
  description: "Frais de déplacement pour réunion client",
  location: "Paris - La Défense",
  
  // Remboursement
  reimbursement: {
    status: "pending", // pending, approved, paid, rejected
    requestedDate: ISODate("2025-06-16T00:00:00Z"),
    approvedDate: null,
    paidDate: null
  },
  
  // Justificatifs
  receipts: [
    {
      filename: "ticket_metro.jpg",
      url: "/uploads/expenses/ticket_metro.jpg"
    }
  ],
  
  // Métadonnées
  createdAt: ISODate("2025-06-15T00:00:00Z"),
  updatedAt: ISODate("2025-06-16T00:00:00Z")
}
```

---

## ⚙️ **Collection: settings**
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  // Paramètres entreprise
  company: {
    name: "Mon Entreprise SARL",
    logo: "/uploads/logo.png",
    siret: "12345678901234",
    tva: "FR12345678901",
    address: {
      street: "123 Rue de la République",
      city: "Paris",
      postalCode: "75001",
      country: "France"
    },
    contact: {
      phone: "+33 1 23 45 67 89",
      email: "contact@mon-entreprise.fr",
      website: "www.mon-entreprise.fr"
    }
  },
  
  // Paramètres de facturation
  invoicing: {
    invoicePrefix: "F",
    quotePrefix: "D",
    nextInvoiceNumber: 1,
    nextQuoteNumber: 1,
    defaultPaymentTerms: 30,
    defaultTaxRate: 20.0,
    currency: "EUR",
    language: "fr"
  },
  
  // Templates d'email
  emailTemplates: {
    invoiceSent: {
      subject: "Facture {{invoiceNumber}} - {{companyName}}",
      body: "Bonjour,\n\nVeuillez trouver ci-joint la facture {{invoiceNumber}}..."
    },
    quoteSent: {
      subject: "Devis {{quoteNumber}} - {{companyName}}",
      body: "Bonjour,\n\nVeuillez trouver ci-joint le devis {{quoteNumber}}..."
    }
  },
  
  // Paramètres de notification
  notifications: {
    emailNotifications: true,
    reminderDays: [7, 3, 1], // Relances avant échéance
    overdueReminderDays: [1, 7, 14] // Relances après échéance
  },
  
  // Métadonnées
  createdAt: ISODate("2025-01-01T00:00:00Z"),
  updatedAt: ISODate("2025-06-30T00:00:00Z")
}
```

---

## 🔍 **Index Recommandés**

```javascript
// Collection users
db.users.createIndex({ "email": 1 }, { unique: true })

// Collection clients
db.clients.createIndex({ "userId": 1 })
db.clients.createIndex({ "userId": 1, "clientNumber": 1 }, { unique: true })
db.clients.createIndex({ "userId": 1, "email": 1 })

// Collection articles
db.articles.createIndex({ "userId": 1 })
db.articles.createIndex({ "userId": 1, "articleNumber": 1 }, { unique: true })

// Collection invoices
db.invoices.createIndex({ "userId": 1 })
db.invoices.createIndex({ "userId": 1, "invoiceNumber": 1 }, { unique: true })
db.invoices.createIndex({ "userId": 1, "clientId": 1 })
db.invoices.createIndex({ "userId": 1, "status": 1 })
db.invoices.createIndex({ "userId": 1, "invoiceDate": -1 })
db.invoices.createIndex({ "userId": 1, "dueDate": 1 })

// Collection quotes
db.quotes.createIndex({ "userId": 1 })
db.quotes.createIndex({ "userId": 1, "quoteNumber": 1 }, { unique: true })
db.quotes.createIndex({ "userId": 1, "clientId": 1 })
db.quotes.createIndex({ "userId": 1, "status": 1 })
db.quotes.createIndex({ "userId": 1, "quoteDate": -1 })

// Collection credit_notes
db.credit_notes.createIndex({ "userId": 1 })
db.credit_notes.createIndex({ "userId": 1, "invoiceId": 1 })

// Collection purchase_invoices
db.purchase_invoices.createIndex({ "userId": 1 })
db.purchase_invoices.createIndex({ "userId": 1, "invoiceDate": -1 })

// Collection expense_reports
db.expense_reports.createIndex({ "userId": 1 })
db.expense_reports.createIndex({ "userId": 1, "date": -1 })

// Collection settings
db.settings.createIndex({ "userId": 1 }, { unique: true })
```

---

## 📊 **Relations**

- **users** ← (1:n) → **clients, articles, invoices, quotes, etc.**
- **clients** ← (1:n) → **invoices, quotes**
- **articles** ← (1:n) → **invoice.items, quote.items**
- **invoices** ← (1:1) → **credit_notes**
- **quotes** ← (1:1) → **invoices** (conversion)

Ce schéma MongoDB offre une structure flexible et scalable pour un système de facturation professionnel complet.