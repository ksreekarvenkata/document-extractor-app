import React from 'react';
import { Card, Form } from 'react-bootstrap';

const ExtractedTextEditor = ({ extractedText, setExtractedText }) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <Card.Title>📝 Extracted Text</Card.Title>
        <Form.Group className="mt-3">
          <Form.Control
            as="textarea"
            rows={18}
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            placeholder="Extracted content will appear here..."
            style={{ resize: 'none', fontFamily: 'monospace' }}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default ExtractedTextEditor;
