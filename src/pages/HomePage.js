// src/pages/HomePage.js
import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';

const HomePage = ({ onStart }) => {
  return (
    <Container className="text-center mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="mb-4">📄 Document Extractor</h1>
          <p className="lead">
            Easily upload PDFs or images and extract text with our intelligent document parsing tool.
          </p>
          <Button variant="primary" size="lg" onClick={onStart}>
            Start Extracting →
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
