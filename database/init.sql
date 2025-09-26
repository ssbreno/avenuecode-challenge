-- Create the persons table
CREATE TABLE IF NOT EXISTS persons (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the sample data from the dataset
INSERT INTO persons (id, first_name, last_name) VALUES
(1, 'Mickey', 'Mouse'),
(2, 'Donald', 'Duck'),
(3, 'Minnie', 'Mouse'),
(4, 'Daisy', 'Duck'),
(5, 'Pluto', 'Dog'),
(6, 'Chip', 'Chipmunk'),
(7, 'Dale', 'Chipmunk'),
(8, 'Olive', 'Oil'),
(9, 'Bruce', 'Wayne'),
(10, 'Peter', 'Parker'),
(11, 'Clark', 'Kent'),
(12, 'Lois', 'Lane'),
(13, 'Luke', 'Skywalker');

-- Reset the sequence to continue from the next available ID
SELECT setval('persons_id_seq', (SELECT MAX(id) FROM persons));
