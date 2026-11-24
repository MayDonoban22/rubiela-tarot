import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const HeaderAuthSimple = ({ variant }) => {
  const isLogin = variant === "login";

  return (
    <header className="relative z-50 w-full border-b border-[#BB9B49]/25 bg-gradient-to-r from-[#101827] via-[#182743] to-[#263D65] text-[#F8F6F0] shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
      <nav
        aria-label="Navegación de acceso"
        className="mx-auto flex min-h-[72px] w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-8 lg:px-14"
      >
        <Link
          to="/"
          aria-label="Luz de Rubí, volver al inicio"
          className="inline-flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6B967]"
        >
          <img
            src="/assets/images/logo-oficial.png"
            alt="Luz de Rubí"
            className="h-[51px] w-auto object-contain transition-transform duration-300 hover:scale-[1.04] sm:h-[55px]"
          />
        </Link>

        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <span className="hidden font-Abhaya text-[20px] italic text-[#E8D8B5]/85 sm:inline">
            Tu espacio espiritual
          </span>
          <Link
            to={isLogin ? "/registro" : "/login"}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#D6B967]/65 px-4 font-inter text-[12px] font-medium text-[#F8F6F0] transition-all duration-300 hover:border-[#E8C977] hover:bg-[#BB9B49]/15 hover:text-[#E8C977] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6B967] sm:px-5 sm:text-[13px]"
          >
            {isLogin ? "Crear cuenta" : "Iniciar sesión"}
            <FaArrowRight size={11} aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default HeaderAuthSimple;
