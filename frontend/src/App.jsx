import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServicios from "./pages/admin/AdminServicios";
import AdminTurnos from "./pages/admin/AdminTurnos";
import AdminUsuarios from "./pages/admin/AdminUsuarios";

function App() {
  return (
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
          {/* RUTAS ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="servicios" element={<AdminServicios />} />
            <Route path="turnos" element={<AdminTurnos />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
