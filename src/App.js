import React, { useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import ExtractorPage from './pages/ExtractorPage';
import HistoryPage from './pages/HistoryPage';
import { Container, Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('extract');

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <DashboardPage onLogin={handleLogin} />;
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Welcome, {user.email}</h5>
        <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
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
