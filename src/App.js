import './App.css';
import LandingPage from './components/Launch';
import Home from './components/Home';
import {Routes, Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;