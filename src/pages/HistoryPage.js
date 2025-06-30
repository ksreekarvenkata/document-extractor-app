import React from 'react';
import { Card, Container } from 'react-bootstrap';

const HistoryPage = () => {
  const history = JSON.parse(localStorage.getItem('extractionHistory')) || [];

  return (
    <Container>
      <h4 className="mb-4">Extraction History</h4>
      {history.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        history.map((record, index) => (
          <Card key={index} className="mb-3 p-3 shadow-sm">
            <h6>{record.fileName}</h6>
            <small className="text-muted">{record.date}</small>
            <p className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>{record.content}</p>
          </Card>
        ))
      )}
    </Container>
  );
};

export default HistoryPage;
