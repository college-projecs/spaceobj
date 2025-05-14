import React, { useState } from 'react';
import CustomPlanet from '../components/three/CustomPlanet';

const realisticValues = {
  orbitRadius: { min: 0.1, max: 3 },
  orbitSpeed: { min: 0.01, max: 5 },
  planetSize: { min: 0.1, max: 2 },
};

type ColorMode = 'terrain' | 'gaseous';
type GasType = 'ammonia' | 'methane';

export default function CustomPlanetsPage() {
  const [planetName, setPlanetName] = useState('');
  const [colorMode, setColorMode] = useState<ColorMode>('terrain');
  const [gasType, setGasType] = useState<GasType>('methane');
  const [planetSize, setPlanetSize] = useState(1);
  const [orbitRadius, setOrbitRadius] = useState(5);
  const [axialTilt, setAxialTilt] = useState(23);
  const [orbitSpeed, setOrbitSpeed] = useState(0.5);
  const [waterThreshold, setWaterThreshold] = useState(0.5);
  const [showRings, setShowRings] = useState(false);
  const [seed, setSeed] = useState(Math.random());

  function regenerateTexture() {
    setSeed(Math.random());
  }

  function savePlanet() {
    fetch('/api/planets/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: planetName,
        seed,
        planet_size: planetSize,
        orbit_radius: orbitRadius,
        axial_tilt: axialTilt,
        orbit_speed: orbitSpeed,
        water_threshold: waterThreshold,
        show_rings: showRings,
        color_mode: colorMode,
        gas_type: gasType,
      }),
    }).then(() => alert('Planet saved!'));
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: 260, padding: 16, color: '#eee', overflowY: 'auto' }}>
        <h2>Planet Settings</h2>

        <div>
          <label>Name:</label><br />
          <input
            type="text"
            value={planetName}
            onChange={e => setPlanetName(e.target.value)}
          />
        </div>

        <div>
          <label>Mode:</label><br />
          <select
            value={colorMode}
            onChange={e => setColorMode(e.target.value as ColorMode)}
          >
            <option value="terrain">Earth Type</option>
            <option value="gaseous">Gaseous</option>
          </select>
        </div>

        {colorMode === 'gaseous' && (
          <div>
            <label>Gas Composition: {gasType === 'methane' ? 'Methane (Blue-White)' : 'Ammonia (Orange-Brown)'}</label><br />
            <input
              type="range"
              min={0}
              max={1}
              step={1}
              value={gasType === 'methane' ? 0 : 1}
              onChange={e => setGasType(e.target.value === '0' ? 'methane' : 'ammonia')}
            />
          </div>
        )}

        <div>
          <label>Size: {planetSize.toFixed(1)}x Earth Size</label><br />
          <input
            type="range"
            min={realisticValues.planetSize.min}
            max={realisticValues.planetSize.max}
            step={0.1}
            value={planetSize}
            onChange={e => setPlanetSize(+e.target.value)}
          />
        </div>

        <div>
          <label>Orbit Radius: {orbitRadius.toFixed(1)} AU</label><br />
          <input
            type="range"
            min={realisticValues.orbitRadius.min}
            max={realisticValues.orbitRadius.max}
            step={0.1}
            value={orbitRadius}
            onChange={e => setOrbitRadius(+e.target.value)}
          />
        </div>

        <div>
          <label>Axial Tilt: {axialTilt}°</label><br />
          <input
            type="range"
            min={0}
            max={90}
            step={1}
            value={axialTilt}
            onChange={e => setAxialTilt(+e.target.value)}
          />
        </div>

        <div>
          <label>Orbit Speed: {orbitSpeed.toFixed(2)} AU/day</label><br />
          <input
            type="range"
            min={realisticValues.orbitSpeed.min}
            max={realisticValues.orbitSpeed.max}
            step={0.01}
            value={orbitSpeed}
            onChange={e => setOrbitSpeed(+e.target.value)}
          />
        </div>

        {colorMode === 'terrain' && (
          <div>
            <label>Water Level: {waterThreshold.toFixed(2)}</label><br />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={waterThreshold}
              onChange={e => setWaterThreshold(+e.target.value)}
            />
          </div>
        )}

        <div>
          <label>
            <input
              type="checkbox"
              checked={showRings}
              onChange={e => setShowRings(e.target.checked)}
            /> Show Rings
          </label>
        </div>

        <div style={{ marginTop: 8 }}>
          <strong>Seed:</strong> {seed.toFixed(6)}
        </div>

        <button onClick={regenerateTexture} style={{ marginTop: 12 }}>
          Re-generate Texture
        </button>
        <button onClick={savePlanet} style={{ marginTop: 12 }}>
          Save Planet
        </button>
      </aside>

      <main style={{ flexGrow: 1 }}>
        <CustomPlanet
          seed={seed}
          planetName={planetName}
          colorMode={colorMode}
          gasType={gasType}
          planetSize={planetSize}
          orbitRadius={orbitRadius}
          axialTilt={axialTilt}
          orbitSpeed={orbitSpeed}
          waterThreshold={waterThreshold}
          showRings={showRings}
        />
      </main>
    </div>
  );
}
