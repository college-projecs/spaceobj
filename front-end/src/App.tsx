import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ComparePage from './pages/ComparePage';
import CustomPlanets from './pages/CustomPlanets';
import HomePage from './pages/Homepage';
import SolarSystemPage from './pages/SolarSystemPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/custom" element={<CustomPlanets />} />
        <Route path="/solarsystem" element={<SolarSystemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
