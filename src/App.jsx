import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings/Settings";
import Reports from "./pages/Reports/Reports";
import "./App.css";

function App() {
  return (
    <div className="center">
      <div className="overlay"></div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="settings/" element={<Settings />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
}

export default App;
