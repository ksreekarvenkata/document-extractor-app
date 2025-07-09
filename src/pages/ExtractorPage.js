// src/pages/ExtractorPage.js
import React, { useRef, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import Tesseract from 'tesseract.js';

// Set worker source safely
const setWorkerSrc = () => {
  const version = pdfjsLib.version || '3.4.120'; // Fallback version
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`;
};

setWorkerSrc();

const ExtractorPage = () => {
  const [fileName, setFileName] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [editableText, setEditableText] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfScale, setPdfScale] = useState(1.0);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Render PDF page to canvas
  const renderPdfPage = async (pageNum) => {
    if (!pdfDoc) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: pdfScale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering PDF page:', error);
    }
  };

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }

    setFileName(file.name);
    setPdfFile(file);
    setExtractedText('');
    setEditableText('');
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);

      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const textContent = await page.getTextContent().catch(() => ({ items: [] }));
        const rawText = textContent.items.map(item => item.str).join(' ');

        if (rawText.trim()) {
          const lines = {};
          textContent.items.forEach(item => {
            const y = Math.floor(item.transform[5]);
            if (!lines[y]) lines[y] = [];
            lines[y].push(item.str);
          });

          const sortedLines = Object.keys(lines)
            .sort((a, b) => b - a)
            .map(y => lines[y].join(' '));

          fullText += `\n--- Page ${i} ---\n${sortedLines.join('\n')}`;
        } else {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          const dataUrl = canvas.toDataURL('image/png');

          const result = await Tesseract.recognize(dataUrl, 'eng', {
            logger: m => console.log(m),
            tessedit_pageseg_mode: 6,
          });

          fullText += `\n--- Page ${i} ---\n${result.data.text.trim()}`;
        }
      }

      setExtractedText(fullText.trim());
      setEditableText(fullText.trim());

      await renderPdfPage(1);
    } catch (err) {
      console.error('Extraction Error:', err);
      alert('Failed to extract text from PDF.');
    }

    setLoading(false);
  };

  // Clear all state
  const handleClear = () => {
    setFileName('');
    setExtractedText('');
    setEditableText('');
    setPdfFile(null);
    setPdfDoc(null);
    setCurrentPage(1);
    setTotalPages(0);
    fileInputRef.current.value = '';
  };

  // Save to localStorage
  const handleSave = () => {
    const currentHistory = JSON.parse(localStorage.getItem('extractionHistory')) || [];
    const newEntry = {
      fileName,
      editableText,
      date: new Date().toLocaleString(),
    };
    localStorage.setItem('extractionHistory', JSON.stringify([newEntry, ...currentHistory]));
    alert('Saved successfully!');
    handleClear();
  };

  // Parse flat string into structured array of pages & lines
  const parseStructuredText = (rawText) => {
    const lines = rawText.split('\n');
    const result = [];
    let currentPage = null;

    for (let line of lines) {
      const pageMatch = line.match(/--- Page (\d+) ---/);
      if (pageMatch) {
        if (currentPage && currentPage.lines.length > 0) {
          result.push(currentPage);
        }
        currentPage = {
          page: parseInt(pageMatch[1], 10),
          lines: []
        };
      } else if (currentPage && line.trim() !== '') {
        currentPage.lines.push(line.trim());
      }
    }

    if (currentPage && currentPage.lines.length > 0) {
      result.push(currentPage);
    }

    return result;
  };

  // Download structured JSON
  const handleDownloadJson = () => {
    const extractedStructure = parseStructuredText(extractedText);
    const editableStructure = parseStructuredText(editableText);

    const dataToSave = {
      fileName,
      extractedTextStructure: extractedStructure,
      editableTextStructure: editableStructure,
      dateExtracted: new Date().toISOString()
    };

    const jsonStr = JSON.stringify(dataToSave, null, 2); // Pretty print
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = `${fileName.replace('.pdf', '')}_structured_extract.json`;
    link.click();
  };

  // Navigate between PDF pages
  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      await renderPdfPage(newPage);
    }
  };

  // Zoom controls
  const handleZoomIn = async () => {
    const newScale = Math.min(pdfScale + 0.2, 3.0);
    setPdfScale(newScale);
    await renderPdfPage(currentPage);
  };

  const handleZoomOut = async () => {
    const newScale = Math.max(pdfScale - 0.2, 0.5);
    setPdfScale(newScale);
    await renderPdfPage(currentPage);
  };

  return (
    <Container fluid className="mt-4">
      <Card className="p-4 mb-4 shadow-sm">
        <h5 className="mb-3">Upload PDF</h5>
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
          <p className="mt-3">Extracting text with layout recognition…</p>
        </div>
      )}

      {extractedText && (
        <Row>
          {/* Left Panel: PDF Viewer */}
          <Col lg={6} md={6} sm={12} className="mb-4">
            <Card className="p-3 h-100 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">PDF Viewer</h6>
                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" size="sm" onClick={handleZoomOut}>
                    -
                  </Button>
                  <span className="px-2" style={{ fontSize: '14px' }}>
                    {Math.round(pdfScale * 100)}%
                  </span>
                  <Button variant="outline-secondary" size="sm" onClick={handleZoomIn}>
                    +
                  </Button>
                </div>
              </div>

              <div
                style={{
                  height: '500px',
                  overflowY: 'auto',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  background: '#f8f9fa',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: '10px'
                }}
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    maxWidth: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span style={{ fontSize: '14px' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </Card>
          </Col>

          {/* Right Panel: Editable Text Area */}
          <Col lg={6} md={6} sm={12} className="mb-4">
            <Card className="p-3 h-100 shadow-sm">
              <div className="d-flex justify-content-end gap-2 mt-3"></div>
              <h6 className="mb-3">Editable Text</h6>
              <Button variant="secondary" onClick={handleDownloadJson}>Download JSON</Button>
              <Form.Control
                as="textarea"
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                style={{
                  height: '500px',
                  resize: 'none',
                  fontSize: '14px',
                  fontFamily: 'monospace'
                }}
              />

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="success" onClick={handleSave}>Save</Button>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ExtractorPage;