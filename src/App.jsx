import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Layout
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Jobs } from './pages/Jobs';
import { Inventory } from './pages/Inventory';
import { Customers } from './pages/Customers';

// Dummy Pages (to be implemented)

import { Billing } from './pages/Billing';
import { Settings } from './pages/Settings';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
