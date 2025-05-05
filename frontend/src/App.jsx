import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Consultas from "./pages/Consultas";
import SobreMi from "./pages/SobreMi";
import Contacto from "./pages/Contacto";
import Agenda from "./pages/Agenda";
import Login from "./pages/Login";
import Registro from "./pages/Register";
// import Navbar from "./components/Navbar"; // Puedes activarlo después si lo usas
import Footer from "./components/Footer/Footer";
import "./index.css";

function App() {
  return (
    <div className="page text-white font-sans">
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/sobre-mi" element={<SobreMi />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
