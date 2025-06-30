import React, { useState, createContext, useContext } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  Header, 
  Sidebar, 
  Dashboard, 
  TestModeBanner,
  Invoices,
  Quotes,
  Clients,
  Articles,
  CreditNotes,
  PurchaseInvoices,
  ExpenseReports
} from './Components';

// Global state context
const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [testMode, setTestMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Global state for all data
  const [globalState, setGlobalState] = useState({
    invoices: [],
    quotes: [],
    clients: [],
    articles: []
  });

  // Global functions to update state
  const updateGlobalState = (key, data) => {
    setGlobalState(prev => ({
      ...prev,
      [key]: data
    }));
  };

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return <Invoices />;
      case 'quotes':
        return <Quotes />;
      case 'clients':
        return <Clients />;
      case 'articles':
        return <Articles />;
      case 'credit-notes':
        return <CreditNotes />;
      case 'purchase-invoices':
        return <PurchaseInvoices />;
      case 'expense-reports':
        return <ExpenseReports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider value={{ globalState, updateGlobalState }}>
      <div className="App min-h-screen bg-gray-50">
        <BrowserRouter>
          <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar 
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              collapsed={sidebarCollapsed}
            />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <Header 
                setSidebarCollapsed={setSidebarCollapsed}
                sidebarCollapsed={sidebarCollapsed}
              />
              
              {/* Test Mode Banner */}
              {testMode && (
                <TestModeBanner onClose={() => setTestMode(false)} />
              )}
              
              {/* Page Content */}
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                {renderCurrentPage()}
              </main>
            </div>
          </div>
        </BrowserRouter>
      </div>
    </AppContext.Provider>
  );
}

export default App;