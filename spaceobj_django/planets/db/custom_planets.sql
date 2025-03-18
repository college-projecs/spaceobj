CREATE TABLE IF NOT EXISTS custom_planets (
    planet_id SERIAL PRIMARY KEY,            
    planet_name VARCHAR(255) NOT NULL,
    mass INTEGER NOT NULL,
    radius INTEGER NOT NULL,
    climate_type INTEGER NOT NULL,
    seed FLOAT NOT NULL,
    notes TEXT,
);