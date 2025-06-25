import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import DashboardPage from './pages/DashboardPage';
import ExtractorPage from './pages/ExtractorPage';
import HistoryPage from './pages/HistoryPage';
import { Container, Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('extract');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        const isExpired = decodedUser.exp * 1000 < Date.now();
        if (isExpired) {
          handleLogout();
        } else {
          setUser(decodedUser);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
  }, []);

  const handleLogin = (data) => {
    const { token } = data;
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) {
    return <DashboardPage onLogin={handleLogin} />;
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Welcome, {user.email}</h5>
        <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
      </div>

      {/* Navigation Tabs */}
      <Nav variant="tabs" activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
        <Nav.Item>
          <Nav.Link eventKey="extract">Extract</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="history">History</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Page Content */}
      <div className="mt-4">
        {activeTab === 'extract' && <ExtractorPage user={user} />}
        {activeTab === 'history' && <HistoryPage user={user} />}
      </div>
    </Container>
  );
}

export default App;
