import React, { useRef, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ExtractorPage = () => {
  const [fileName, setFileName] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [editableText, setEditableText] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);

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
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const handleClear = () => {
    setFileName('');
    setExtractedText('');
    setEditableText('');
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
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
      {/* File Upload Card */}
      <Card className="p-4 mb-4 shadow-sm">
        <Form.Group controlId="formFile">
          <Form.Label><strong>Select a PDF Document</strong></Form.Label>
          <Form.Control
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </Form.Group>

        <Form.Group controlId="formImage" className="mt-3">
          <Form.Label><strong>Upload an Image</strong></Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={imageInputRef}
          />
        </Form.Group>

        {(fileName || imagePreviewUrl) && (
          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="mb-2">
              {fileName && <div><strong>PDF:</strong> {fileName}</div>}
              {imagePreviewUrl && <div><strong>Image Uploaded</strong></div>}
            </div>
            <Button variant="danger" size="sm" onClick={handleClear}>
              Delete All
            </Button>
          </div>
        )}
      </Card>

      {/* Responsive Image Preview */}
      {imagePreviewUrl && (
        <Card className="mb-4 p-3 shadow-sm text-center">
          <h6 className="mb-3">Responsive Image Preview</h6>
          <Image
            src={imagePreviewUrl}
            alt="Uploaded Preview"
            fluid
            rounded
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </Card>
      )}

      {/* PDF Text View/Edit Panels */}
      {extractedText && (
        <Row>
          <Col lg={6} sm={12} className="mb-4">
            <Card className="p-3 h-100 shadow-sm">
              <h6 className="mb-3">Preview Document</h6>
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
              <h6 className="mb-3">Editable Document</h6>
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
