import React, { useState } from 'react';

// Mock Data
const mockInvoices = [
  { id: 'F001', client: 'ABC SARL', amount: '1,250.00', date: '15/06/2025', status: 'Payée', dueDate: '15/07/2025' },
  { id: 'F002', client: 'XYZ Consulting', amount: '2,100.00', date: '20/06/2025', status: 'En attente', dueDate: '20/07/2025' },
  { id: 'F003', client: 'Tech Solutions', amount: '890.50', date: '25/06/2025', status: 'Envoyée', dueDate: '25/07/2025' }
];

const mockClients = [
  { id: 1, name: 'ABC SARL', email: 'contact@abc-sarl.fr', phone: '01.23.45.67.89', city: 'Paris', totalInvoices: 15, totalAmount: '12,450.00' },
  { id: 2, name: 'XYZ Consulting', email: 'info@xyz-consulting.fr', phone: '01.98.76.54.32', city: 'Lyon', totalInvoices: 8, totalAmount: '8,920.00' },
  { id: 3, name: 'Tech Solutions', email: 'hello@techsolutions.fr', phone: '01.11.22.33.44', city: 'Marseille', totalInvoices: 22, totalAmount: '18,670.50' }
];

const mockQuotes = [
  { id: 'D001', client: 'ABC SARL', amount: '950.00', date: '28/06/2025', status: 'Accepté', validUntil: '28/07/2025' },
  { id: 'D002', client: 'New Client Corp', amount: '1,800.00', date: '29/06/2025', status: 'En attente', validUntil: '29/07/2025' },
  { id: 'D003', client: 'Small Business', amount: '675.00', date: '30/06/2025', status: 'Brouillon', validUntil: '30/07/2025' }
];

// Header Component
export const Header = ({ setSidebarCollapsed, sidebarCollapsed }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-600 hover:text-gray-900 md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-1">
              <span className="text-xl font-bold text-indigo-600">Facture</span>
              <span className="text-xl font-bold text-gray-800">.net</span>
              <span className="text-xs text-orange-500 font-medium ml-1">by freeland</span>
            </div>
          </div>
          
          {/* Top Navigation Tabs */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium">
              💜 Facturation
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              👥 Clients
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
              📊 Ventes
            </a>
          </nav>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <span className="text-sm">vivearoua@gm...</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mon profil</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paramètres</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Déconnexion</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Test Mode Banner Component
export const TestModeBanner = ({ onClose }) => {
  return (
    <div className="bg-gradient-to-r from-orange-400 to-yellow-400 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-800">
            <strong>MODE TEST :</strong> Ce mode vous permet de tester l'outil. Pour repartir à zéro et commencer à utiliser vraiment l'outil, cliquez sur ce bouton à droite.
          </span>
        </div>
        <button
          onClick={onClose}
          className="bg-white text-gray-800 px-4 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Quitter le mode test
        </button>
      </div>
    </div>
  );
};

// Sidebar Component
export const Sidebar = ({ currentPage, setCurrentPage, collapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊', active: true },
    { id: 'quotes', label: 'Devis', icon: '📄', badge: '+' },
    { id: 'invoices', label: 'Factures', icon: '🧾', badge: '+' },
    { id: 'credit-notes', label: 'Avoirs', icon: '↩️', badge: '+' },
    { id: 'advance-invoices', label: "Factures d'acompte", icon: '💰', badge: '+' },
    { id: 'articles', label: 'Articles', icon: '📦', badge: '+' },
    { id: 'purchase-invoices', label: "Factures d'achat", icon: '🛒', badge: '+' },
    { id: 'expense-reports', label: 'Notes de frais', icon: '🧾', badge: '+' }
  ];

  return (
    <aside className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentPage === item.id
                  ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

// Dashboard Component
export const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Ce mois');
  const [activeTab, setActiveTab] = useState('Statistiques');

  const tabs = ['Statistiques', 'Activités', 'Documents générés', 'Chiffre d\'affaires', 'Débours'];
  
  const stats = [
    { label: 'Mois', value: 'Juin 2025', color: 'bg-blue-500' },
    { label: 'Factures', value: '15', color: 'bg-green-500' },
    { label: 'Avoirs', value: '2', color: 'bg-orange-500' },
    { label: 'Chiffre d\'affaires', value: '€12,450', color: 'bg-purple-500' },
    { label: 'Encaissements', value: '€10,200', color: 'bg-teal-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Period Selector */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Sélectionner une période</label>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option>Ce mois</option>
          <option>Mois dernier</option>
          <option>Ce trimestre</option>
          <option>Cette année</option>
        </select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-8 h-8 rounded-full ${stat.color} opacity-20`}></div>
            </div>
            <div className="mt-4">
              <div className={`h-2 rounded-full ${stat.color} opacity-30`}>
                <div className={`h-2 rounded-full ${stat.color} w-3/4`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Activité récente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Facture F003 payée</p>
                <p className="text-xs text-gray-500">Il y a 2 heures</p>
              </div>
              <span className="text-sm font-medium text-green-600">€890.50</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📄</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nouveau devis D003 créé</p>
                <p className="text-xs text-gray-500">Il y a 4 heures</p>
              </div>
              <span className="text-sm font-medium text-blue-600">€675.00</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">👤</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nouveau client ajouté</p>
                <p className="text-xs text-gray-500">Hier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Invoices Component
export const Invoices = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Nouvelle facture
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Échéance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{invoice.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.dueDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === 'Payée' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Voir</button>
                    <button className="text-green-600 hover:text-green-900 mr-3">Modifier</button>
                    <button className="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Quotes Component
export const Quotes = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Devis</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          + Nouveau devis
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valide jusqu'au</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{quote.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.validUntil}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      quote.status === 'Accepté' ? 'bg-green-100 text-green-800' :
                      quote.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Convertir</button>
                    <button className="text-green-600 hover:text-green-900 mr-3">Modifier</button>
                    <button className="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Clients Component
export const Clients = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          + Nouveau client
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factures</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.totalInvoices}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{client.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Voir</button>
                    <button className="text-green-600 hover:text-green-900 mr-3">Modifier</button>
                    <button className="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Articles Component
export const Articles = () => {
  const mockArticles = [
    { id: 1, name: 'Développement Web', description: 'Service de développement web', price: '75.00', unit: 'heure', category: 'Services' },
    { id: 2, name: 'Consultation IT', description: 'Consultation en technologies', price: '120.00', unit: 'heure', category: 'Conseil' },
    { id: 3, name: 'Formation React', description: 'Formation développement React', price: '450.00', unit: 'jour', category: 'Formation' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          + Nouvel article
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{article.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{article.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 mr-3">Modifier</button>
                    <button className="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Credit Notes Component
export const CreditNotes = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Avoirs</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          + Nouvel avoir
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun avoir pour le moment</h3>
        <p className="text-gray-500 mb-4">Créez votre premier avoir pour rembourser ou créditer un client.</p>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Créer un avoir
        </button>
      </div>
    </div>
  );
};

// Purchase Invoices Component
export const PurchaseInvoices = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Factures d'achat</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          + Nouvelle facture d'achat
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🛒</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune facture d'achat</h3>
        <p className="text-gray-500 mb-4">Enregistrez vos achats et dépenses professionnelles.</p>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Ajouter une facture d'achat
        </button>
      </div>
    </div>
  );
};

// Expense Reports Component
export const ExpenseReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notes de frais</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          + Nouvelle note de frais
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🧾</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune note de frais</h3>
        <p className="text-gray-500 mb-4">Suivez vos frais professionnels et remboursements.</p>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Créer une note de frais
        </button>
      </div>
    </div>
  );
};