// src/pages/ExtractorPage.js
import React, { useRef, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import Tesseract from 'tesseract.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ExtractorPage = () => {
  const [fileName, setFileName] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [editableText, setEditableText] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setExtractedText('');
    setEditableText('');
    setLoading(true);

    try {
      if (file.type === 'application/pdf') {
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;

          const dataUrl = canvas.toDataURL('image/png');

          // Layout OCR using Tesseract with PSM 1 (Automatic page segmentation with OSD)
          const result = await Tesseract.recognize(dataUrl, 'eng', {
            tessedit_pageseg_mode: 1,
            logger: (m) => console.log(m),
          });

          fullText += `\n--- Page ${i} ---\n${result.data.text.trim()}\n`;
        }

        setExtractedText(fullText.trim());
        setEditableText(fullText.trim());
      } else {
        alert('Only PDF files are supported.');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      alert('Failed to extract text from PDF.');
    }

    setLoading(false);
  };

  const handleClear = () => {
    setFileName('');
    setExtractedText('');
    setEditableText('');
    fileInputRef.current.value = '';
  };

  const handleSave = () => {
    const currentHistory = JSON.parse(localStorage.getItem('extractionHistory')) || [];
    const newEntry = {
      fileName,
      text: editableText,
      date: new Date().toLocaleString(),
    };
    localStorage.setItem('extractionHistory', JSON.stringify([newEntry, ...currentHistory]));
    alert('Saved successfully!');
    handleClear();
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 mb-4 shadow-sm">
        <h5 className="mb-3">Upload Sea Waybill or Scanned PDF</h5>
        <Form.Group>
          <Form.Label><strong>PDF File</strong></Form.Label>
          <Form.Control type="file" accept=".pdf" onChange={handleFileChange} ref={fileInputRef} />
        </Form.Group>

        {fileName && (
          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
            <div className="mb-2"><strong>File:</strong> {fileName}</div>
            <Button variant="danger" size="sm" onClick={handleClear}>Clear</Button>
          </div>
        )}
      </Card>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Performing OCR with layout recognition…</p>
        </div>
      )}

      {extractedText && (
        <>
          <Row>
            <Col lg={6} sm={12} className="mb-4">
              <Card className="p-3 h-100 shadow-sm">
                <h6 className="mb-3">Exact Extracted Text (Read-Only)</h6>
                <div style={{ height: '400px', overflowY: 'scroll', background: '#f8f9fa', padding: '10px', whiteSpace: 'pre-wrap', border: '1px solid #ccc', borderRadius: '8px' }}>
                  {extractedText}
                </div>
              </Card>
            </Col>

            <Col lg={6} sm={12} className="mb-4">
              <Card className="p-3 h-100 shadow-sm">
                <h6 className="mb-3">Editable Text</h6>
                <Form.Control
                  as="textarea"
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  rows={20}
                  style={{ height: '400px', resize: 'none' }}
                />
              </Card>
            </Col>
          </Row>

          <div className="text-end mt-3">
            <Button variant="success" onClick={handleSave}>Save</Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default ExtractorPage;
