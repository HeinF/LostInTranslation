import "./App.css";
import Login from "./components/Login";
import Translate from "./components/Translate";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Translate" element={<Translate />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
