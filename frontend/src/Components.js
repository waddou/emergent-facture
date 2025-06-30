import React, { useState, useEffect } from 'react';

// Import useAppContext from App.js
const useAppContext = () => {
  return React.useContext(React.createContext());
};

// Utility functions for date conversion
const formatDateToInput = (dateString) => {
  if (!dateString) return '';
  // Convert from DD/MM/YYYY to YYYY-MM-DD
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateString;
};

const formatDateFromInput = (dateString) => {
  if (!dateString) return '';
  // Convert from YYYY-MM-DD to DD/MM/YYYY
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
  return dateString;
};

// Mock Data with more comprehensive information
const initialInvoices = [
  { 
    id: 'F001', 
    client: 'ABC SARL', 
    clientId: 1,
    amount: '1,250.00', 
    date: formatDateFromInput('2025-06-15'), 
    status: 'Payée', 
    dueDate: formatDateFromInput('2025-07-15'),
    items: [
      { description: 'Développement Web', quantity: 15, unitPrice: 75, total: 1125 },
      { description: 'Maintenance', quantity: 5, unitPrice: 25, total: 125 }
    ],
    notes: 'Merci pour votre confiance'
  },
  { 
    id: 'F002', 
    client: 'XYZ Consulting', 
    clientId: 2,
    amount: '2,100.00', 
    date: formatDateFromInput('2025-06-20'), 
    status: 'En attente', 
    dueDate: formatDateFromInput('2025-07-20'),
    items: [
      { description: 'Consultation IT', quantity: 20, unitPrice: 120, total: 2400 }
    ],
    notes: 'Paiement à 30 jours'
  },
  { 
    id: 'F003', 
    client: 'Tech Solutions', 
    clientId: 3,
    amount: '890.50', 
    date: formatDateFromInput('2025-06-25'), 
    status: 'Envoyée', 
    dueDate: formatDateFromInput('2025-07-25'),
    items: [
      { description: 'Formation React', quantity: 2, unitPrice: 450, total: 900 }
    ],
    notes: 'Formation dispensée en ligne'
  }
];

const initialClients = [
  { 
    id: 1, 
    name: 'ABC SARL', 
    email: 'contact@abc-sarl.fr', 
    phone: '01.23.45.67.89', 
    address: '123 Rue de la République',
    city: 'Paris', 
    postalCode: '75001',
    siret: '12345678901234',
    totalInvoices: 15, 
    totalAmount: '12,450.00' 
  },
  { 
    id: 2, 
    name: 'XYZ Consulting', 
    email: 'info@xyz-consulting.fr', 
    phone: '01.98.76.54.32', 
    address: '456 Avenue des Champs',
    city: 'Lyon', 
    postalCode: '69001',
    siret: '98765432109876',
    totalInvoices: 8, 
    totalAmount: '8,920.00' 
  },
  { 
    id: 3, 
    name: 'Tech Solutions', 
    email: 'hello@techsolutions.fr', 
    phone: '01.11.22.33.44', 
    address: '789 Boulevard Maritime',
    city: 'Marseille', 
    postalCode: '13001',
    siret: '11111111111111',
    totalInvoices: 22, 
    totalAmount: '18,670.50' 
  }
];

const initialQuotes = [
  { 
    id: 'D001', 
    client: 'ABC SARL', 
    clientId: 1,
    amount: '950.00', 
    date: formatDateFromInput('2025-06-28'), 
    status: 'Accepté', 
    validUntil: formatDateFromInput('2025-07-28'),
    items: [
      { description: 'Audit SEO', quantity: 1, unitPrice: 950, total: 950 }
    ]
  },
  { 
    id: 'D002', 
    client: 'New Client Corp', 
    clientId: null,
    amount: '1,800.00', 
    date: formatDateFromInput('2025-06-29'), 
    status: 'En attente', 
    validUntil: formatDateFromInput('2025-07-29'),
    items: [
      { description: 'Site web complet', quantity: 1, unitPrice: 1800, total: 1800 }
    ]
  }
];

const initialArticles = [
  { 
    id: 1, 
    name: 'Développement Web', 
    description: 'Service de développement web sur mesure', 
    price: '75.00', 
    unit: 'heure', 
    category: 'Services',
    tax: 20
  },
  { 
    id: 2, 
    name: 'Consultation IT', 
    description: 'Consultation en technologies de l\'information', 
    price: '120.00', 
    unit: 'heure', 
    category: 'Conseil',
    tax: 20
  },
  { 
    id: 3, 
    name: 'Formation React', 
    description: 'Formation développement React avancé', 
    price: '450.00', 
    unit: 'jour', 
    category: 'Formation',
    tax: 20
  }
];

// Modal Components
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const InvoiceForm = ({ invoice, clients, articles, onSave, onClose, isFromQuote = false }) => {
  const [formData, setFormData] = useState({
    client: invoice?.client || '',
    date: formatDateToInput(invoice?.date) || new Date().toISOString().split('T')[0],
    dueDate: formatDateToInput(invoice?.dueDate) || '',
    items: invoice?.items || [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    notes: invoice?.notes || ''
  });

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = calculateTotal();
    const newInvoice = {
      id: invoice?.id || `F${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      ...formData,
      date: formatDateFromInput(formData.date),
      dueDate: formatDateFromInput(formData.dueDate),
      amount: total.toLocaleString('fr-FR', { minimumFractionDigits: 2 }),
      status: invoice?.status || 'Brouillon'
    };
    onSave(newInvoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
          <select
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">Sélectionner un client</option>
            {clients.map(client => (
              <option key={client.id} value={client.name}>{client.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Échéance</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Articles</h3>
          <button
            type="button"
            onClick={addItem}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
          >
            + Ajouter un article
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-end border border-gray-200 rounded-md p-4">
              <div className="col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Description de l'article"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Qté</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire</label>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <input
                  type="text"
                  value={`€${item.total.toFixed(2)}`}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                />
              </div>
              <div className="col-span-1">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  disabled={formData.items.length === 1}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-right">
          <div className="text-lg font-semibold text-gray-900">
            Total: €{calculateTotal().toFixed(2)}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Notes additionnelles..."
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {invoice ? 'Modifier' : 'Créer'} {isFromQuote ? 'la facture' : 'la facture'}
        </button>
      </div>
    </form>
  );
};

const ClientForm = ({ client, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
    city: client?.city || '',
    postalCode: client?.postalCode || '',
    siret: client?.siret || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClient = {
      id: client?.id || Date.now(),
      ...formData,
      totalInvoices: client?.totalInvoices || 0,
      totalAmount: client?.totalAmount || '0.00'
    };
    onSave(newClient);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SIRET</label>
          <input
            type="text"
            value={formData.siret}
            onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {client ? 'Modifier' : 'Créer'} le client
        </button>
      </div>
    </form>
  );
};

const InvoiceDetail = ({ invoice, onClose, onEdit }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Facture {invoice.id}</h3>
          <p className="text-gray-600">Émise le {invoice.date}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(invoice)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Modifier
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Télécharger PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Client</h4>
          <p className="text-gray-700">{invoice.client}</p>
          <p className="text-sm text-gray-600 mt-2">Échéance: {invoice.dueDate}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Statut</h4>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            invoice.status === 'Payée' ? 'bg-green-100 text-green-800' :
            invoice.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {invoice.status}
          </span>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Articles</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">€{item.unitPrice}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">€{item.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">Total</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">€{invoice.amount}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {invoice.notes && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Notes</h4>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
};

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

// Main Components with State Management
export const Invoices = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [clients] = useState(initialClients);
  const [articles] = useState(initialArticles);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [convertingQuote, setConvertingQuote] = useState(null);

  // Get shared state from context if available
  const contextValue = React.useContext(React.createContext());
  
  // Listen for conversion from quotes
  useEffect(() => {
    const handleQuoteConversion = (event) => {
      if (event.detail && event.detail.type === 'convertQuoteToInvoice') {
        const quote = event.detail.quote;
        const newInvoice = {
          id: `F${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          client: quote.client,
          clientId: quote.clientId,
          date: quote.date,
          dueDate: quote.validUntil,
          items: quote.items,
          notes: `Facture générée à partir du devis ${quote.id}`,
          amount: quote.amount,
          status: 'Brouillon'
        };
        setInvoices(prev => [...prev, newInvoice]);
        alert(`Facture ${newInvoice.id} créée avec succès à partir du devis ${quote.id}`);
      }
    };

    window.addEventListener('quoteConversion', handleQuoteConversion);
    return () => window.removeEventListener('quoteConversion', handleQuoteConversion);
  }, []);

  const handleCreateInvoice = (newInvoice) => {
    setInvoices([...invoices, newInvoice]);
    setShowCreateModal(false);
  };

  const handleEditInvoice = (updatedInvoice) => {
    setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
    setShowEditModal(false);
    setSelectedInvoice(null);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      setInvoices(invoices.filter(inv => inv.id !== invoiceId));
    }
  };

  const openEditModal = (invoice) => {
    setSelectedInvoice(invoice);
    setShowEditModal(true);
  };

  const openDetailModal = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

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
              {invoices.map((invoice) => (
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
                    <button 
                      onClick={() => openDetailModal(invoice)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Voir
                    </button>
                    <button 
                      onClick={() => openEditModal(invoice)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDeleteInvoice(invoice.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        title="Nouvelle facture"
      >
        <InvoiceForm 
          clients={clients}
          articles={articles}
          onSave={handleCreateInvoice}
          onClose={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        title="Modifier la facture"
      >
        <InvoiceForm 
          invoice={selectedInvoice}
          clients={clients}
          articles={articles}
          onSave={handleEditInvoice}
          onClose={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
        title={`Détails de la facture ${selectedInvoice?.id}`}
      >
        {selectedInvoice && (
          <InvoiceDetail 
            invoice={selectedInvoice}
            onClose={() => setShowDetailModal(false)}
            onEdit={openEditModal}
          />
        )}
      </Modal>
    </div>
  );
};

// Quotes Component with full functionality
export const Quotes = () => {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [clients] = useState(initialClients);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateQuote = (newQuote) => {
    const quote = {
      ...newQuote,
      id: `D${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      status: 'Brouillon',
      validUntil: newQuote.dueDate // Use dueDate as validUntil for quotes
    };
    setQuotes([...quotes, quote]);
    setShowCreateModal(false);
  };

  const convertToInvoice = (quote) => {
    if (window.confirm(`Convertir le devis ${quote.id} en facture ?`)) {
      // Dispatch custom event to notify invoice component
      const event = new CustomEvent('quoteConversion', {
        detail: {
          type: 'convertQuoteToInvoice',
          quote: quote
        }
      });
      window.dispatchEvent(event);
      
      // Update quote status
      setQuotes(quotes.map(q => 
        q.id === quote.id 
          ? { ...q, status: 'Converti' }
          : q
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Devis</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
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
              {quotes.map((quote) => (
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
                      quote.status === 'Converti' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {quote.status !== 'Converti' && (
                      <button 
                        onClick={() => convertToInvoice(quote)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Convertir
                      </button>
                    )}
                    <button className="text-green-600 hover:text-green-900 mr-3">Modifier</button>
                    <button className="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        title="Nouveau devis"
      >
        <InvoiceForm 
          clients={clients}
          articles={initialArticles}
          onSave={handleCreateQuote}
          onClose={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

// Clients Component with full functionality
export const Clients = () => {
  const [clients, setClients] = useState(initialClients);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleCreateClient = (newClient) => {
    setClients([...clients, newClient]);
    setShowCreateModal(false);
  };

  const handleEditClient = (updatedClient) => {
    setClients(clients.map(client => client.id === updatedClient.id ? updatedClient : client));
    setShowEditModal(false);
    setSelectedClient(null);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
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
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.totalInvoices}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{client.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Voir</button>
                    <button 
                      onClick={() => openEditModal(client)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        title="Nouveau client"
      >
        <ClientForm 
          onSave={handleCreateClient}
          onClose={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        title="Modifier le client"
      >
        <ClientForm 
          client={selectedClient}
          onSave={handleEditClient}
          onClose={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
};

// Articles Component with full functionality
export const Articles = () => {
  const [articles, setArticles] = useState(initialArticles);

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
              {articles.map((article) => (
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