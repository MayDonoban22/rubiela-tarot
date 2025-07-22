import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Consultas from "./pages/Consultas";
import SobreMi from "./pages/SobreMi";
import Contacto from "./pages/Contacto";
import Agenda from "./pages/Agenda";
import Login from "./pages/Login";
import Registro from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AppContext from "./contexts/AppContext";
import { getToken } from "./utils/token";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // <-- estado de carga inicial

  useEffect(() => {
    const token = getToken();
    if (token) setIsLoggedIn(true);
    setIsLoading(false); // <-- después de leer el token
  }, []);

  if (isLoading) return null; // o <LoadingScreen />

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <BrowserRouter>
        <div className="page font-sans border border-[var(--color-goldLight)]">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Home />
                  <Footer />
                </>
              }
            />
            <Route
              path="/consultas"
              element={
                <>
                  <Header />
                  <Consultas />
                  <Footer />
                </>
              }
            />
            <Route
              path="/sobre-mi"
              element={
                <>
                  <Header />
                  <SobreMi />
                  <Footer />
                </>
              }
            />
            <Route
              path="/contacto"
              element={
                <>
                  <Header />
                  <Contacto />
                  <Footer />
                </>
              }
            />
            <Route
              path="/agenda"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <Agenda />
                    <Footer />
                  </>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
