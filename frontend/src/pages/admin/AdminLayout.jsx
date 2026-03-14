import { Outlet } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
