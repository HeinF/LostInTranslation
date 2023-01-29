import "./App.css";
import Login from "./components/Login";
import Translate from "./components/Translate";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Translate" element={<Translate />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
