import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar'
import AdminHeader from '../components/AdminHeader';
const AdminLayout = () => {

  useEffect(() => {
    // Set hidden chỉ khi vào admin
    document.body.style.overflow = 'hidden';
    return () => {
      // Reset khi rời admin (về frontend)
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden px-1">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;