import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Consultas from "./pages/Consultas";
import SobreMi from "./pages/SobreMi";
import Contacto from "./pages/Contacto";
import Agenda from "./pages/Agenda";
// import Login from "./pages/Login";
// import Registro from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <div className="page font-sans border border-[var(--color-goldLight)]">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/sobre-mi" element={<SobreMi />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/agenda" element={<Agenda />} />
          {/*<Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} /> */}
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
