import React from 'react';
import { Card } from 'react-bootstrap';

const DocumentViewer = ({ file }) => {
  const fileURL = file ? URL.createObjectURL(file) : null;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>📄 Document Preview</Card.Title>
        {fileURL && (
          <iframe
            src={fileURL}
            title="PDF Preview"
            width="100%"
            height="500px"
            style={{ border: '1px solid #ccc', borderRadius: '4px' }}
          />
        )}
      </Card.Body>
    </Card>
  );
};

export default DocumentViewer;
