import './App.css';
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import Poll from "./pages/Poll";
import { Routes, Route } from "react-router-dom";
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poll" element={<Poll />} />
        </Routes>
      </div>

      <Footer />

    </div>
  );
}

export default App;
