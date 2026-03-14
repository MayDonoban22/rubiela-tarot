import { useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/token";

function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-primary border-b border-[var(--color-goldLight)]">
      <h1 className="text-xl font-bold text-[var(--color-goldLight)]">
        Panel de Administración
      </h1>

      <button
        onClick={handleLogout}
        className="bg-[var(--color-goldLight)] text-primary px-4 py-2 rounded-md font-semibold hover:opacity-90 transition cursor-pointer"
      >
        Cerrar sesión
      </button>
    </header>
  );
}

export default AdminHeader;
