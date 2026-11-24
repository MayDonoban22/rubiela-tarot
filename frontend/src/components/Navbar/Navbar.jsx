import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";
import AppContext from "../../contexts/AppContext";

const navigation = [
  { label: "Inicio", to: "/" },
  { label: "Consultas", to: "/consultas" },
  { label: "Sobre mí", to: "/sobre-mi" },
  { label: "Contacto", to: "/contacto" },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6B967]";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const menuButtonRef = useRef(null);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 1280) setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/", { replace: true });
  };

  return (
    <nav
      aria-label="Navegación principal"
      className="relative border-b border-[#BB9B49]/25 bg-gradient-to-r from-[#101827] via-[#182743] to-[#263D65] text-[#F8F6F0] shadow-[0_10px_24px_rgba(0,0,0,0.11)]"
    >
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-10 xl:px-14">
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="Luz de Rubí, ir al inicio"
          className={`relative z-20 inline-flex shrink-0 items-center rounded-md ${focusRing}`}
        >
          <img
            src="/assets/images/logo-oficial.png"
            alt="Luz de Rubí"
            className="h-[52px] w-auto object-contain transition-transform duration-300 hover:scale-[1.04] xl:h-[57px]"
          />
        </Link>

        <div className="hidden items-center gap-5 xl:flex 2xl:gap-8">
          {navigation.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `group relative rounded-sm py-3 font-inter text-[14px] font-medium tracking-[0.015em] transition-colors duration-300 hover:text-[#E8C977] ${focusRing} ${
                  isActive ? "text-[#E8C977]" : "text-[#F8F6F0]/85"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-1 left-0 h-px bg-[#D6B967] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          {isLoggedIn ? (
            <>
              <Link
                to="/agenda"
                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#BB9B49] to-[#D6B967] px-5 font-inter text-[13px] font-semibold text-[#111827] shadow-[0_6px_20px_rgba(187,155,73,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_9px_25px_rgba(187,155,73,0.26)] ${focusRing}`}
              >
                Agendar consulta <FaArrowRight size={11} aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={`min-h-10 rounded-full border border-white/20 px-4 font-inter text-[13px] font-medium text-[#F8F6F0]/85 transition-colors duration-300 hover:border-[#D6B967]/70 hover:text-[#E8C977] ${focusRing}`}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`rounded-full px-3 py-2 font-inter text-[13px] text-[#F8F6F0]/90 transition-colors hover:text-[#E8C977] ${focusRing}`}
              >
                Iniciar sesión
              </Link>
              <Link
                to="/consultas"
                className={`inline-flex min-h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#BB9B49] to-[#D6B967] px-5 font-inter text-[13px] font-semibold text-[#111827] transition-all duration-300 hover:-translate-y-0.5 ${focusRing}`}
              >
                Ver consultas <FaArrowRight size={11} aria-hidden="true" />
              </Link>
            </>
          )}
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="luz-de-rubi-menu-movil"
          onClick={() => setIsOpen((current) => !current)}
          className={`relative z-20 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#BB9B49]/45 bg-white/5 text-[#E8C977] transition-colors hover:bg-white/10 xl:hidden ${focusRing}`}
        >
          {isOpen ? (
            <FaTimes size={19} aria-hidden="true" />
          ) : (
            <FaBars size={19} aria-hidden="true" />
          )}
        </button>
      </div>

      {isOpen && (
        <div
          id="luz-de-rubi-menu-movil"
          className="absolute inset-x-0 top-full z-10 max-h-[calc(100dvh-100px)] overflow-y-auto border-b border-[#BB9B49]/30 bg-[#101827]/98 px-4 py-6 shadow-2xl backdrop-blur-xl sm:px-8 xl:hidden"
        >
          <div className="mx-auto flex max-w-xl flex-col gap-1">
            <p className="mb-3 px-4 font-inter text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D6B967]">
              Descubre Luz de Rubí
            </p>
            {navigation.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3.5 font-inter text-[14px] transition-colors ${focusRing} ${
                    isActive
                      ? "bg-[#BB9B49]/15 text-[#E8C977]"
                      : "text-[#F8F6F0]/90 hover:bg-white/10"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="my-3 h-px bg-[#BB9B49]/25" />
            {isLoggedIn ? (
              <>
                <Link
                  to="/agenda"
                  onClick={closeMenu}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#BB9B49] to-[#D6B967] px-5 font-inter text-[14px] font-semibold text-[#111827] ${focusRing}`}
                >
                  Agendar consulta <FaArrowRight size={12} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`min-h-12 rounded-full border border-[#BB9B49]/45 font-inter text-[14px] text-[#F8F6F0] ${focusRing}`}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={`flex min-h-12 items-center justify-center rounded-full border border-[#BB9B49]/45 font-inter text-[14px] text-[#F8F6F0] ${focusRing}`}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/consultas"
                  onClick={closeMenu}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#BB9B49] to-[#D6B967] px-5 font-inter text-[14px] font-semibold text-[#111827] ${focusRing}`}
                >
                  Ver consultas <FaArrowRight size={12} aria-hidden="true" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
