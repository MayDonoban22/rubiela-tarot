import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";

function AdminSidebar() {
  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-md transition font-medium";

  const activeLink = "bg-[var(--color-goldLight)] text-primary";

  const inactiveLink = "text-tertiary hover:bg-[var(--color-goldLight)]/20";

  return (
    <aside className="w-64 bg-primary border-r border-[var(--color-goldLight)] p-4">
      <h2 className="text-xl font-bold text-[var(--color-goldLight)] mb-6">
        Panel Admin
      </h2>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeLink : inactiveLink}`
          }
        >
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/servicios"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeLink : inactiveLink}`
          }
        >
          <FaClipboardList />
          Servicios
        </NavLink>

        <NavLink
          to="/admin/turnos"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeLink : inactiveLink}`
          }
        >
          <FaCalendarAlt />
          Turnos
        </NavLink>

        <NavLink
          to="/admin/usuarios"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeLink : inactiveLink}`
          }
        >
          <FaUsers />
          Usuarios
        </NavLink>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
