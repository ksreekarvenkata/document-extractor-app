// src/pages/DashboardPage.js
import React, { useState } from 'react';
import {
  Container,
  Navbar,
  Nav,
  Badge,
  Modal,
  Button,
  Form,
  Row,
  Col,
  Alert,
} from 'react-bootstrap';
import { BsFileEarmarkText } from 'react-icons/bs';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const DashboardPage = ({ onLogin }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeForm, setActiveForm] = useState('login');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!isValidEmail(loginEmail) || !loginPassword.trim()) {
      setError('Please enter valid credentials.');
      setMessage('');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('token', data.token);
      onLogin(data);
      setError('');
      setShowModal(false);
    } catch (err) {
      setError(err.message);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signupFirstName || !signupLastName || !signupEmail || !signupPassword) {
      setError('All fields are required.');
      setMessage('');
      return;
    }
    if (!isValidEmail(signupEmail)) {
      setError('Invalid email format.');
      setMessage('');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: signupFirstName,
          lastName: signupLastName,
          email: signupEmail,
          password: signupPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');
      setMessage('Account created successfully! You can now login.');
      setError('');
      setActiveForm('login');
    } catch (err) {
      setError(err.message);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (formType) => {
    setActiveForm(formType);
    setError('');
    setMessage('');
    setShowModal(true);
  };

  return (
    <div className={`position-relative ${showModal ? 'blur-background' : ''}`} style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f9fafe, #e6ecfd)' }}>
      <Navbar bg="transparent" expand="lg" className="px-4 pt-3">
        <Navbar.Brand href="#" className="fw-bold text-primary">
          Extractor
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link onClick={() => openModal('login')} className="me-3 fw-semibold text-dark" style={{ cursor: 'pointer' }}>
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container className="d-flex flex-column align-items-center justify-content-center text-center py-5">
        <div className="mb-4 mt-5">
          <BsFileEarmarkText size={90} color="#6c63ff" />
        </div>
        <h1><span style={{ color: '#6c63ff', fontWeight: 700 }}>Extractor</span></h1>
        <p className="mt-3 mb-4 text-muted fs-5">
          Advanced document processing for PDFs, images, and handwritten content.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Badge bg="light" text="dark" className="px-3 py-2 border rounded-pill shadow-sm">
            <span className="text-success me-2">✦</span> PDF Processing
          </Badge>
          <Badge bg="light" text="dark" className="px-3 py-2 border rounded-pill shadow-sm">
            <span className="text-primary me-2">✦</span> Image OCR
          </Badge>
          <Badge bg="light" text="dark" className="px-3 py-2 border rounded-pill shadow-sm">
            <span style={{ color: '#a259ff' }} className="me-2">✦</span> Handwriting Recognition
          </Badge>
        </div>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{activeForm === 'login' ? 'Login' : 'Sign Up'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col>
              <Button variant={activeForm === 'login' ? 'primary' : 'outline-primary'} className="w-100" onClick={() => { setActiveForm('login'); setError(''); setMessage(''); }}>Login</Button>
            </Col>
            <Col>
              <Button variant={activeForm === 'signup' ? 'primary' : 'outline-primary'} className="w-100" onClick={() => { setActiveForm('signup'); setError(''); setMessage(''); }}>Sign Up</Button>
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          {activeForm === 'login' ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={loginEmail} required isInvalid={loginEmail && !isValidEmail(loginEmail)} onChange={(e) => setLoginEmail(e.target.value)} />
                <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" value={loginPassword} required onChange={(e) => setLoginPassword(e.target.value)} />
              </Form.Group>
              <Button className="w-100" variant="primary" onClick={handleLogin} disabled={!loginEmail || !loginPassword || !isValidEmail(loginEmail) || loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control placeholder="Enter your first name" value={signupFirstName} required onChange={(e) => setSignupFirstName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control placeholder="Enter your last name" value={signupLastName} required onChange={(e) => setSignupLastName(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={signupEmail} required isInvalid={signupEmail && !isValidEmail(signupEmail)} onChange={(e) => setSignupEmail(e.target.value)} />
                <Form.Control.Feedback type="invalid">Please enter a valid email address.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Create password" value={signupPassword} required onChange={(e) => setSignupPassword(e.target.value)} />
              </Form.Group>
              <Button className="w-100" variant="success" onClick={handleSignUp} disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <style>{`
        .blur-background {
          filter: blur(4px);
          pointer-events: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
