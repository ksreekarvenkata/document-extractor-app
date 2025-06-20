import React, { useEffect, useState } from 'react';
import { Card, ListGroup } from 'react-bootstrap';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('extractionHistory')) || [];
    setHistory(saved);
  }, []);

  return (
    <Card className="p-3 shadow-sm">
      <Card.Title>Extraction History</Card.Title>
      {history.length === 0 ? (
        <p>No extractions saved yet.</p>
      ) : (
        <ListGroup>
          {history.map((item, idx) => (
            <ListGroup.Item key={idx}>
              <strong>{item.fileName}</strong>
              <br />
              <small>{item.date}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card>
  );
};

export default HistoryPage;
