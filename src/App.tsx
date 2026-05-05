import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Create from './pages/Create'
import Success from './pages/Success'
import Experience from './pages/Experience'
import {  AnimatePresence } from 'framer-motion'

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create" element={<Create />} />
          <Route path="/success/:id" element={<Success />} />
          <Route path="/e/:id" element={<Experience />} />
        </Routes>
      </AnimatePresence>
    </Router>

  );
}

export default App;
