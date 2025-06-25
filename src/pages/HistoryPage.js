import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Container } from 'react-bootstrap';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('extractionHistory')) || [];
    setHistory(saved);
  }, []);

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <Card.Title> Extraction History</Card.Title>
        {history.length === 0 ? (
          <p>No extractions saved yet.</p>
        ) : (
          <ListGroup>
            {history.map((item, idx) => (
              <ListGroup.Item key={idx}>
                <strong>{item.fileName}</strong>
                <br />
                <small>{item.date}</small>
                <br />
                <pre className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                  {item.text.length > 200 ? item.text.slice(0, 200) + '...' : item.text}
                </pre>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>
    </Container>
  );
};

export default HistoryPage;
