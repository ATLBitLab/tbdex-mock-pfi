-- migrate:up
CREATE TABLE Offering (
  id INT PRIMARY KEY AUTO_INCREMENT,
  offeringId VARCHAR(255) NOT NULL,
  baseCurrency VARCHAR(3) NOT NULL,
  quoteCurrency VARCHAR(3) NOT NULL,
  offering JSON NOT NULL,
  INDEX (offeringId)
);

-- migrate:down
DROP TABLE Offering;
