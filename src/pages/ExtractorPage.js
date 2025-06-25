// src/pages/ExtractorPage.js

import React, { useRef, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const ExtractorPage = () => {
  const [fileName, setFileName] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [editableText, setEditableText] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === 'application/pdf') {
      try {
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += `Page ${i}:\n`;
          fullText += content.items.map((item) => item.str).join(' ') + '\n\n';
        }

        setExtractedText(fullText.trim());
        setEditableText(fullText.trim());
        setImagePreviewUrl(null); // Hide image preview if a PDF was selected
      } catch (err) {
        alert('Failed to process PDF.');
        console.error(err);
      }
    } else if (file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
      setExtractedText('Extracted text from image goes here...');
      setEditableText('Extracted text from image goes here...');
    } else {
      alert('Please upload a valid PDF or image file.');
    }
  };

  const handleClear = () => {
    setFileName('');
    setExtractedText('');
    setEditableText('');
    setImagePreviewUrl(null);
    fileInputRef.current.value = '';
  };

  const renderParagraphs = (text, editable = false) => {
    return text.split(/\n\n+/).map((para, idx) => (
      <Card key={idx} className="mb-3 p-2 border border-secondary">
        {editable ? (
          <Form.Control
            as="textarea"
            rows={3}
            value={para}
            onChange={(e) => {
              const newParas = editableText.split(/\n\n+/);
              newParas[idx] = e.target.value;
              setEditableText(newParas.join('\n\n'));
            }}
            style={{ resize: 'none', background: 'transparent', border: 'none' }}
          />
        ) : (
          <div>{para}</div>
        )}
      </Card>
    ));
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 mb-4 shadow-sm">
        <h5 className="mb-3">Upload Document</h5>
        <Form.Group controlId="formFile">
          <Form.Label><strong>Upload PDF or Image</strong></Form.Label>
          <Form.Control
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </Form.Group>

        {fileName && (
          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="mb-2">
              <strong>File:</strong> {fileName}
            </div>
            <Button variant="danger" size="sm" onClick={handleClear}>Clear</Button>
          </div>
        )}
      </Card>

      {imagePreviewUrl && (
        <Card className="mb-4 p-3 shadow-sm text-center">
          <h6 className="mb-3">Preview Image</h6>
          <Image
            src={imagePreviewUrl}
            alt="Preview"
            fluid
            rounded
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </Card>
      )}

      {extractedText && (
        <Row>
          <Col lg={6} sm={12} className="mb-4">
            <Card className="p-3 h-100 shadow-sm">
              <h6 className="mb-3">Extracted Text</h6>
              <div style={{
                height: '400px',
                overflowY: 'scroll',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px'
              }}>
                {renderParagraphs(extractedText)}
              </div>
            </Card>
          </Col>

          <Col lg={6} sm={12} className="mb-4">
            <Card className="p-3 h-100 shadow-sm">
              <h6 className="mb-3">Editable Text</h6>
              <div style={{
                height: '400px',
                overflowY: 'scroll',
                backgroundColor: '#fff3cd',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px'
              }}>
                {renderParagraphs(editableText, true)}
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ExtractorPage;
