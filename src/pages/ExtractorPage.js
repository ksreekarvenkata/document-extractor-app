// src/pages/ExtractorPage.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry';

// ✅ Set up local PDF.js worker
GlobalWorkerOptions.workerSrc = workerSrc;

const ExtractorPage = () => {
  const [fileName, setFileName] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [editableText, setEditableText] = useState('');

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFileName(selectedFile.name);

      const buffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += `Page ${i}:\n`;
        fullText += content.items.map(item => item.str).join(' ') + '\n\n';
      }

      setExtractedText(fullText.trim());
      setEditableText(fullText.trim());
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleClear = () => {
    setFileName('');
    setExtractedText('');
    setEditableText('');
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 mb-4">
        <Form.Group controlId="formFile">
          <Form.Label><strong>Select a PDF Document</strong></Form.Label>
          <Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
        </Form.Group>
        {fileName && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span><strong>Selected:</strong> {fileName}</span>
            <Button variant="danger" size="sm" onClick={handleClear}>Delete</Button>
          </div>
        )}
      </Card>

      {extractedText && (
        <Row>
          <Col md={6}>
            <Card className="p-3 mb-4 shadow-sm">
              <h6>Extracted Text (Read-only)</h6>
              <div
                style={{
                  height: '400px',
                  overflowY: 'scroll',
                  whiteSpace: 'pre-wrap',
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              >
                {extractedText}
              </div>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-3 mb-4 shadow-sm">
              <h6>Editable Text</h6>
              <Form.Control
                as="textarea"
                rows={18}
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                style={{ resize: 'none', fontFamily: 'monospace' }}
              />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ExtractorPage;
