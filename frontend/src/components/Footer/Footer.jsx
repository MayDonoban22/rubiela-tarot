import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaInstagram, FaFacebookF } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-primary font-inter text-[16px] font-normal text-tertiary">
      <div className="max-w-8xl mx-auto py-18 pb-4 px-6 flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="flex-1">
          <h3 className="bg-gradient-to-b from-[var(--color-goldLight)] to-[var(--color-goldDark)] bg-clip-text text-transparent text-[30px] font-Abhaya font-extrabold mb-4">
            Luz de Rubí
          </h3>
          <p className="mb-5">Rubiela Pineda Cortés</p>
          <p>Consultas espirituales con energía positiva</p>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <h3 className="bg-gradient-to-b from-[var(--color-goldLight)] to-[var(--color-goldDark)] bg-clip-text text-transparent text-[25px] font-Abhaya font-extrabold mb-4">
            Enlaces Rápidos
          </h3>
          <ul className="space-y-1 text-center">
            <li>
              <Link to="/" className="hover:underline">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/consultas" className="hover:underline">
                Consultas
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:underline">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex-1 flex flex-col items-end">
          <h3 className="bg-gradient-to-b from-[var(--color-goldLight)] to-[var(--color-goldDark)] bg-clip-text text-transparent text-[25px] font-Abhaya font-extrabold mb-4">
            Contáctame
          </h3>
          <div className="flex items-center mb-2">
            <FaPhone className="mb-2 mr-2 text-[16px] text-[var(--color-goldLight)]" />
            <span className="mb-2">+57 123 456 7890</span>
          </div>
          <div className="flex items-center mb-4">
            <FaEnvelope className="mr-2 text-[16px] text-[var(--color-goldLight)]" />
            <span>rubiela@luzderubi.com</span>
          </div>
          <div className="flex space-x-4">
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

      <hr className="border-t border-[var(--color-line)]/20 mx-[37px]" />

      <div className="text-center py-4 text-[var(--color-softWhite)]/54 text-[14px]">
        &copy; 2025 Luz de Rubí. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
