import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings/Settings";
import Reports from "./pages/Reports/Reports";
import "./App.css";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <Layout>
      <div className="overlay"></div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="settings/" element={<Settings />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Layout>
  );
}

export default App;
