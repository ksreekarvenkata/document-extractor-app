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
  Spinner, // ADDED: For a better loading indicator
} from 'react-bootstrap';
import { BsFileEarmarkText } from 'react-icons/bs';

// MODIFIED: Point to your local backend server
const API_BASE_URL = 'https://localhost:3443';

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

  // --- ADDED: Validation functions to match your backend's rules ---
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  };

  const isStrongPassword = (password) => {
    // This regex matches your backend's requirements
    const strongPassRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPassRegex.test(password);
  };

  const isValidName = (name) => typeof name === 'string' && name.trim().length >= 2;
  // --- End of new validation functions ---

  const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        // MODIFIED: Prioritize the specific error message from your backend API
        throw new Error(data.error || `Request failed with status ${response.status}`);
    }
    return data;
  };

  // Handle Login
  const handleLogin = async () => {
    setError('');
    if (!isValidEmail(loginEmail) || !loginPassword) {
      setError('Please enter a valid email and password.');
      return;
    }
    setLoading(true);
    try {
      // MODIFIED: Corrected template literal syntax for the fetch URL
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await handleResponse(response);
      localStorage.setItem('token', data.token);
      onLogin(data); // This should trigger a state change in the parent App.js
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async () => {
    setError('');
    setMessage('');
    // MODIFIED: Added more specific client-side validation before sending
    if (!isValidName(signupFirstName) || !isValidName(signupLastName)) {
      setError("First and last names must be at least 2 characters long.");
      return;
    }
    if (!isValidEmail(signupEmail)) {
      setError("Invalid or unsupported email. Use gmail.com, yahoo.com, or outlook.com.");
      return;
    }
    if (!isStrongPassword(signupPassword)) {
      setError("Password must be 8+ chars, with 1 uppercase, 1 number, & 1 special character.");
      return;
    }
    setLoading(true);
    try {
      // MODIFIED: Corrected template literal syntax
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
      const data = await handleResponse(response);
      setMessage(data.message + ' You can now login.');
      setActiveForm('login'); // Switch to login form on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (formType) => {
    setActiveForm(formType);
    setError('');
    setMessage('');
    setLoginEmail(''); // Clear fields when opening modal
    setLoginPassword('');
    setSignupFirstName('');
    setSignupLastName('');
    setSignupEmail('');
    setSignupPassword('');
    setShowModal(true);
  };

  return (
    <div
      // MODIFIED: Corrected className syntax
      className={`position-relative ${showModal ? 'blur-background' : ''}`}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f9fafe, #e6ecfd)',
      }}
    >
      <Navbar bg="transparent" expand="lg" className="px-4 pt-3">
        <Navbar.Brand href="#" className="fw-bold text-primary">
          Extractor
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link
              onClick={() => openModal('login')}
              className="me-3 fw-semibold text-dark"
            >
              Login
            </Nav.Link>
            <Button variant="primary" onClick={() => openModal('signup')}>
              Sign Up
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* ... The rest of the JSX is mostly the same, with minor improvements ... */}
      <Container className="d-flex flex-column align-items-center justify-content-center text-center py-5">
        <div className="mb-4 mt-5">
          <BsFileEarmarkText size={90} color="#6c63ff" />
        </div>
        <h1><span style={{ color: '#6c63ff', fontWeight: 700 }}>Extractor</span></h1>
        <p className="mt-3 mb-4 text-muted fs-5">Advanced document processing for PDFs, images, and handwritten content.</p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Badge bg="light" text="dark" className="px-3 py-2 border rounded-pill shadow-sm"><span className="text-success me-2">✦</span> PDF Processing</Badge>
          <Badge bg="light" text="dark" className="px-3 py-2 border rounded-pill shadow-sm"><span className="text-primary me-2">✦</span> Image OCR</Badge>
          <Badge bg="light" text="dark" className="px-3 py-2 border rounded-pill shadow-sm"><span style={{ color: '#a259ff' }} className="me-2">✦</span> Handwriting Recognition</Badge>
        </div>
      </Container>
      
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{activeForm === 'login' ? 'Login' : 'Sign Up'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* ... Tabs for Login/Sign Up ... */}
          <Row className="mb-3">
            <Col><Button variant={activeForm === 'login' ? 'primary' : 'outline-primary'} className="w-100" onClick={() => { setActiveForm('login'); setError(''); setMessage(''); }}>Login</Button></Col>
            <Col><Button variant={activeForm === 'signup' ? 'primary' : 'outline-primary'} className="w-100" onClick={() => { setActiveForm('signup'); setError(''); setMessage(''); }}>Sign Up</Button></Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          {activeForm === 'login' ? (
            <Form noValidate onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="user@gmail.com" value={loginEmail} required isInvalid={!!(loginEmail && !isValidEmail(loginEmail))} onChange={(e) => setLoginEmail(e.target.value)} />
                <Form.Control.Feedback type="invalid">Please use a valid gmail, yahoo, or outlook address.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" value={loginPassword} required onChange={(e) => setLoginPassword(e.target.value)} />
              </Form.Group>
              <Button className="w-100" type="submit" variant="primary" disabled={loading}>{loading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Logging in...</> : 'Login'}</Button>
            </Form>
          ) : (
            <Form noValidate onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
              {/* MODIFIED: Added interactive validation feedback */}
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control placeholder="John" value={signupFirstName} required isInvalid={!!(signupFirstName && !isValidName(signupFirstName))} onChange={(e) => setSignupFirstName(e.target.value)} />
                    <Form.Control.Feedback type="invalid">Must be at least 2 characters.</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control placeholder="Doe" value={signupLastName} required isInvalid={!!(signupLastName && !isValidName(signupLastName))} onChange={(e) => setSignupLastName(e.target.value)} />
                    <Form.Control.Feedback type="invalid">Must be at least 2 characters.</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="user@gmail.com" value={signupEmail} required isInvalid={!!(signupEmail && !isValidEmail(signupEmail))} onChange={(e) => setSignupEmail(e.target.value)} />
                <Form.Control.Feedback type="invalid">Please use a valid gmail, yahoo, or outlook address.</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Create password" value={signupPassword} required isInvalid={!!(signupPassword && !isStrongPassword(signupPassword))} onChange={(e) => setSignupPassword(e.target.value)} />
                <Form.Control.Feedback type="invalid">8+ chars, 1 uppercase, 1 number, 1 special char.</Form.Control.Feedback>
              </Form.Group>
              <Button className="w-100" type="submit" variant="success" disabled={loading}>{loading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Creating...</> : 'Create Account'}</Button>
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