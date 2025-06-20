import React, { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import ExtractorPage from './pages/ExtractorPage';
import HistoryPage from './pages/HistoryPage';
import { Container, Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('extract');
  const [theme, setTheme] = useState('light');

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  if (!user) {
    return <DashboardPage onLogin={setUser} />;
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Welcome, {user.name}</h5>
        <div>
          <Button variant="outline-secondary" onClick={toggleTheme} className="me-2">
            {theme === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
          <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <Nav variant="tabs" activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
        <Nav.Item>
          <Nav.Link eventKey="extract">Extract</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="history">History</Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="mt-4">
        {activeTab === 'extract' && <ExtractorPage />}
        {activeTab === 'history' && <HistoryPage />}
      </div>
    </Container>
  );
}

export default App;
