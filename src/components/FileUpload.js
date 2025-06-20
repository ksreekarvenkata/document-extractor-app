import React, { useState } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Use CDN for worker to avoid local issues
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FileUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [editableText, setEditableText] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file && file.type === 'application/pdf') {
      const text = await extractTextFromPDF(file);
      setUploadedFile(file);
      setExtractedText(text);
      setEditableText(text);
    } else {
      alert('Only PDF files are supported.');
    }
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let textContent = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      textContent += pageText + '\n\n';
    }

    return textContent;
  };

  const handleDelete = () => {
    setUploadedFile(null);
    setExtractedText('');
    setEditableText('');
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Form.Group controlId="formFile">
          <Form.Label><strong>Select a PDF Document</strong></Form.Label>
          <Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
        </Form.Group>

        {uploadedFile && (
          <>
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <div><strong>Selected:</strong> {uploadedFile.name}</div>
              <Button variant="outline-danger" size="sm" onClick={handleDelete}>
                Delete
              </Button>
            </div>

            <Row className="mt-4">
              <Col md={6}>
                <h5>Extracted Text (Read-only)</h5>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '1rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.25rem',
                  height: '400px',
                  overflowY: 'scroll',
                  whiteSpace: 'pre-wrap'
                }}>
                  {extractedText}
                </div>
              </Col>
              <Col md={6}>
                <h5>Edit Extracted Text</h5>
                <Form.Control
                  as="textarea"
                  rows={20}
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  style={{
                    height: '400px',
                    overflowY: 'scroll',
                    resize: 'none'
                  }}
                />
              </Col>
            </Row>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default FileUpload;
