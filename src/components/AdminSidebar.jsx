import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Package,
  Clock,
  Users,
  WalletCards,
  FileText
} from 'lucide-react';
import { useState } from 'react';

const AdminSidebar = () => {

  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <div className="w-60 flex-shrink-0 bg-white border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-gray-200">
        <Link to="/admin/" className="flex items-center gap-2">
          <div className="text-xl font-serif font-bold text-gray-900">BookHaven Admin</div>
        </Link>
      </div>

      <nav className="p-4 space-y-1">
        <Link
          to="/admin/"
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-700  transition-colors ${activeIndex === 1 ? 'rounded-lg text-white bg-blue-500 font-medium' : 'hover:bg-gray-100 hover:text-blue-600'}`}
          onClick={() => setActiveIndex(1)}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/admin/books/"
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-700  transition-colors ${activeIndex === 2 ? 'rounded-lg text-white bg-blue-500 font-medium' : 'hover:bg-gray-100 hover:text-blue-600'}`}
          onClick={() => setActiveIndex(2)}
        >
          <BookOpen className="h-5 w-5" />
          <span>Quản lý sách</span>
        </Link>
        <Link
          to="/admin/categories/"
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-700  transition-colors ${activeIndex === 3 ? 'rounded-lg text-white bg-blue-500 font-medium' : 'hover:bg-gray-100 hover:text-blue-600'}`}
          onClick={() => setActiveIndex(3)}
        >
          <WalletCards className="h-5 w-5" />
          <span>Quản lý danh mục</span>
        </Link>
        <Link
          to="/admin/orders/"
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-700  transition-colors ${activeIndex === 4 ? 'rounded-lg text-white bg-blue-500 font-medium' : 'hover:bg-gray-100 hover:text-blue-600'}`}
          onClick={() => setActiveIndex(4)}
        >
          <Package className="h-5 w-5" />
          <span>Quản lý đơn mua</span>
        </Link>
        <Link
          to="/admin/rentals/"
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-700  transition-colors ${activeIndex === 5 ? 'rounded-lg text-white bg-blue-500 font-medium' : 'hover:bg-gray-100 hover:text-blue-600'}`}
          onClick={() => setActiveIndex(5)}
        >
          <Clock className="h-5 w-5" />
          <span>Quản lý đơn thuê</span>
        </Link>
        <Link
          to="/admin/users/"
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-700  transition-colors ${activeIndex === 6 ? 'rounded-lg text-white bg-blue-500 font-medium' : 'hover:bg-gray-100 hover:text-blue-600'}`}
          onClick={() => setActiveIndex(6)}
        >
          <Users className="h-5 w-5" />
          <span>Quản lý người dùng</span>
        </Link>
        <Link
          to="/admin/policies/"
          className={`flex items-center gap-3 p-3 rounded-lg text-gray-700  transition-colors ${activeIndex === 7 ? 'rounded-lg text-white bg-blue-500 font-medium' : 'hover:bg-gray-100 hover:text-blue-600'}`}
          onClick={() => setActiveIndex(7)}
        >
          <FileText className="h-5 w-5" />
          <span>Quản lý chính sách</span>
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;