import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import AppContext from "../../contexts/AppContext";
import { removeToken } from "../../utils/token";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="text-tertiary font-inter text-[18px] border border-[var(--color-goldLight)] relative z-20">
      <div className="mx-auto px-4 py-3 flex items-center justify-between relative z-10 bg-gradient-to-l from-secondary to-primary">
        <Link to="/" className="text-tertiary text-xl font-light">
          <img
            src="/assets/images/logo-oficial.png"
            alt="Luz de Rubí"
            className="h-12 md:h-16 lg:h-22"
          />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:underline text-sm lg:text-base">
            Inicio
          </Link>
          <Link
            to="/consultas"
            className="hover:underline text-sm lg:text-base"
          >
            Consultas
          </Link>
          <Link to="/sobre-mi" className="hover:underline text-sm lg:text-base">
            Sobre mí
          </Link>
          <Link to="/contacto" className="hover:underline text-sm lg:text-base">
            Contacto
          </Link>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="bg-tertiary text-[#7b6222f0] px-4 py-2 rounded-md font-semibold hover:shadow-md transition text-sm lg:text-base"
            >
              Iniciar sesión
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-tertiary text-[#7b6222f0] cursor-pointer px-4 py-2 rounded-md font-semibold hover:shadow-md transition text-sm lg:text-base"
            >
              Cerrar sesión
            </button>
          )}
        </div>
        <button
          className="md:hidden text-[var(--color-goldLight)] focus:outline-none cursor-pointer"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-primary/50 backdrop-blur-md text-tertiary flex flex-col items-center gap-4 py-6 animate-slide-down shadow-lg fixed top-0 w-full z-0 pt-[136px] h-full">
          <Link to="/" onClick={toggleMenu} className="hover:underline">
            Inicio
          </Link>
          <Link
            to="/consultas"
            onClick={toggleMenu}
            className="hover:underline"
          >
            Consultas
          </Link>
          <Link to="/sobre-mi" onClick={toggleMenu} className="hover:underline">
            Sobre mí
          </Link>
          <Link to="/contacto" onClick={toggleMenu} className="hover:underline">
            Contacto
          </Link>

          {!isLoggedIn ? (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="bg-tertiary text-[#7b6222f0] px-4 py-2 rounded-md font-semibold hover:shadow-md transition"
            >
              Iniciar sesión
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="bg-tertiary text-[#7b6222f0] px-4 py-2 rounded-md font-semibold hover:shadow-md transition"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
