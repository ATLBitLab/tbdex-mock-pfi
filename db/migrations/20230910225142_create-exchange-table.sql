-- migrate:up
CREATE TABLE Exchange (
  id INT PRIMARY KEY AUTO_INCREMENT,
  exchangeId VARCHAR(255) NOT NULL,
  messageId VARCHAR(255) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  messageKind ENUM('rfq', 'quote', 'order', 'close', 'orderstatus') NOT NULL,
  message JSON NOT NULL,
  INDEX (exchangeId),
  INDEX (subject),
  INDEX (messageKind)
);
-- migrate:down
DROP TABLE Exchange;
