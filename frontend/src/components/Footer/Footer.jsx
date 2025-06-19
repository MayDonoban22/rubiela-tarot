import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaInstagram, FaFacebookF } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-primary font-inter text-tertiary text-sm md:text-base lg:text-lg">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 flex flex-col md:flex-row gap-10 md:gap-8">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl md:text-2xl lg:text-3xl bg-gradient-to-b from-[var(--color-goldLight)] to-[var(--color-goldDark)] bg-clip-text text-transparent font-Abhaya font-extrabold mb-2">
            Luz de Rubí
          </h3>
          <p className="mb-1 text-sm md:text-base lg:text-lg">
            Rubiela Pineda Cortés
          </p>
          <p className="text-sm md:text-base lg:text-lg">
            Consultas espirituales con energía positiva
          </p>
        </div>
        <div className="flex-1 text-center">
          <h3 className="text-lg md:text-xl lg:text-2xl bg-gradient-to-b from-[var(--color-goldLight)] to-[var(--color-goldDark)] bg-clip-text text-transparent font-Abhaya font-extrabold mb-3">
            Enlaces Rápidos
          </h3>
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                className="hover:underline text-sm md:text-base lg:text-lg"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/consultas"
                className="hover:underline text-sm md:text-base lg:text-lg"
              >
                Consultas
              </Link>
            </li>
            <li>
              <Link
                to="/contacto"
                className="hover:underline text-sm md:text-base lg:text-lg"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex-1 text-center md:text-right">
          <h3 className="text-lg md:text-xl lg:text-2xl bg-gradient-to-b from-[var(--color-goldLight)] to-[var(--color-goldDark)] bg-clip-text text-transparent font-Abhaya font-extrabold mb-3">
            Contáctame
          </h3>
          <div className="flex justify-center md:justify-end items-center mb-2">
            <FaPhone className="mr-2 text-[var(--color-goldLight)]" />
            <span className="text-sm md:text-base lg:text-lg">
              +57 123 456 7890
            </span>
          </div>
          <div className="flex justify-center md:justify-end items-center mb-4">
            <FaEnvelope className="mr-2 text-[var(--color-goldLight)]" />
            <span className="text-sm md:text-base lg:text-lg">
              rubiela@luzderubi.com
            </span>
          </div>
          <div className="flex justify-center md:justify-end space-x-4">
            <a
              href="https://instagram.com/turubroficial"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 bg-gradient-to-b from-[var(--color-goldLight)] to-[var(--color-goldDark)]"
            >
              <FaInstagram className="text-tertiary text-lg" />
            </a>
            <a
              href="https://facebook.com/turubroficial"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 bg-gradient-to-b from-[var(--color-goldLight)] to-[var(--color-goldDark)]"
            >
              <FaFacebookF className="text-tertiary text-lg" />
            </a>
          </div>
        </div>
      </div>

      <hr className="border-t border-[var(--color-line)]/20 mx-4" />

      <div className="text-center py-4 text-[var(--color-softWhite)]/54 text-xs md:text-sm lg:text-base">
        &copy; 2025 Luz de Rubí. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
