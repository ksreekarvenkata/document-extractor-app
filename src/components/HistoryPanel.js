import React from 'react';
import { ListGroup, Card } from 'react-bootstrap';

const HistoryPanel = ({ history }) => {
  if (!history.length) return null;

  return (
    <Card className="p-3 mb-4">
      <h5>Previous Uploads:</h5>
      <ListGroup>
        {history.map((item, index) => (
          <ListGroup.Item key={index}>
            {item.name} - {new Date(item.time).toLocaleString()}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default HistoryPanel;

