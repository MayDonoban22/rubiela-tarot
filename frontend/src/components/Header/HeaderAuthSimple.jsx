import { Link } from "react-router-dom";

const HeaderAuthSimple = ({ variant }) => {
  const isLogin = variant === "login";

  return (
    <header className="text-tertiary font-inter text-[18px] border-b border-[var(--color-goldLight)] relative z-50">
      <div className="mx-auto px-4 py-3 flex items-center justify-between relative z-10 bg-primary">
        <Link to="/" className="text-tertiary text-xl font-light">
          <img
            src="/assets/images/logo-oficial.png"
            alt="Luz de Rubí"
            className="h-12 md:h-16 lg:h-22"
          />
        </Link>
        <div className="flex items-center gap-4">
          {isLogin ? (
            <Link
              to="/registro"
              className="bg-tertiary text-[#7b6222f0] px-4 py-2 rounded-md font-semibold hover:shadow-md transition text-sm lg:text-base"
            >
              Regístrate
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-tertiary text-[#7b6222f0] px-4 py-2 rounded-md font-semibold hover:shadow-md transition text-sm lg:text-base"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderAuthSimple;
