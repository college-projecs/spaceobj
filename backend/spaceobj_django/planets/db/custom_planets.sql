CREATE TABLE IF NOT EXISTS custom_planets (
    planet_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    seed FLOAT NOT NULL,
    planet_size  FLOAT NOT NULL,
    orbit_radius FLOAT NOT NULL,
    axial_tilt FLOAT NOT NULL,
    orbit_speed FLOAT NOT NULL,
    water_threshold FLOAT NOT NULL,
    show_rings BOOLEAN NOT NULL,
    color_mode VARCHAR(50) NOT NULL,
    gas_type   VARCHAR(50) NOT NULL
);