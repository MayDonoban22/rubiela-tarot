import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-l from-secondary to-primary text-tertiary font-inter text-[18px] border border-[var(--color-goldLight)]">
      <div className="max-w-7xl mx-auto px-1 py-1 flex items-center justify-between">
        <Link to="/" className="text-tertiary text-xl font-light">
          <img
            src="/assets/images/logo-oficial.png"
            alt="Luz de Rubí"
            className="h-25"
          />
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:underline">
            Inicio
          </Link>
          <Link to="/consultas" className="hover:underline">
            Consultas
          </Link>
          <Link to="/sobre-mi" className="hover:underline">
            Sobre mí
          </Link>
          <Link to="/contacto" className="hover:underline">
            Contacto
          </Link>

          <Link
            to="/login"
            className="ml-4 bg-tertiary text-[#7b6222f0] px-4 py-2 rounded-md font-semibold hover:shadow-md transition"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
