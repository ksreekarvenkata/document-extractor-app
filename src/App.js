// MODIFIED: Import syntax and function name corrected
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // CORRECTED IMPORT: Use named import with curly braces
import DashboardPage from './pages/DashboardPage';
import ExtractorPage from './pages/ExtractorPage';
import HistoryPage from './pages/HistoryPage';
import { Container, Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('extract');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token); // CORRECTED USAGE: Use jwtDecode (camelCase)
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
    const decodedUser = jwtDecode(token); // CORRECTED USAGE: Use jwtDecode (camelCase)
    setUser(decodedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  if (!user) {
    return <DashboardPage onLogin={handleLogin} />;
  }

  return (
    <Container className={`py-4 ${theme}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Welcome, {user.email}</h5>
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
        {activeTab === 'extract' && <ExtractorPage user={user} />}
        {activeTab === 'history' && <HistoryPage user={user} />}
      </div>
    </Container>
  );
}

export default App;