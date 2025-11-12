import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  WalletCards,
  Package,
  Clock,
  Users,
  FileText,
  LogOut,
  User,
  Settings,
  ChevronDown,
  UserPen,
  Building,
  Ticket
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutState } from '../stores/authSlice';

const AdminSidebar = () => {
  const naviagate = useNavigate();
  const dispatch = useDispatch();

  const [activeIndex, setActiveIndex] = useState(1);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logoutState());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");

    //naviagate('/login');
    window.location.href = '/admin/login'
  };

  const adminInfo = {
    name: 'Admin User',
    email: 'admin@bookhaven.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Super Admin'
  };

  return (
    <div className="w-60 flex-shrink-0 bg-gray-900 border-r border-gray-700 overflow-hidden flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-700">
        <Link to="/admin/" className="flex items-center gap-2">
          <div className="text-xl font-serif font-bold text-white">BookHaven Admin</div>
        </Link>
      </div>

      {/* Navigation - Chiếm không gian còn lại */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        <Link
          to="/admin/"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeIndex === 1 ? 'text-white bg-blue-600 font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveIndex(1)}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/admin/books/"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeIndex === 2 ? 'text-white bg-blue-600 font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveIndex(2)}
        >
          <BookOpen className="h-5 w-5" />
          <span>Quản lý sách</span>
        </Link>
        <Link
          to="/admin/categories/"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeIndex === 3 ? 'text-white bg-blue-600 font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveIndex(3)}
        >
          <WalletCards className="h-5 w-5" />
          <span>Quản lý danh mục</span>
        </Link>
        <Link
          to="/admin/authors/"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeIndex === 8 ? 'text-white bg-blue-600 font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveIndex(8)}
        >
          <UserPen className="h-5 w-5" />
          <span>Quản lý tác giả</span>
        </Link>
        <Link
          to="/admin/publishers/"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeIndex === 9 ? 'text-white bg-blue-600 font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveIndex(9)}
        >
          <Building className="h-5 w-5" />
          <span>Quản lý nhà xuất bản</span>
        </Link>
        <Link
          to="/admin/vouchers/"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeIndex === 10 ? 'text-white bg-blue-600 font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveIndex(10)}
        >
          <Ticket className="h-5 w-5" />
          <span>Quản lý voucher</span>
        </Link>
        <Link
          to="/admin/orders/"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeIndex === 4 ? 'text-white bg-blue-600 font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveIndex(4)}
        >
          <Package className="h-5 w-5" />
          <span>Quản lý đơn mua</span>
        </Link>
        <Link
          to="/admin/rentals/"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeIndex === 5 ? 'text-white bg-blue-600 font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveIndex(5)}
        >
          <Clock className="h-5 w-5" />
          <span>Quản lý đơn thuê</span>
        </Link>
        <Link
          to="/admin/users/"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeIndex === 6 ? 'text-white bg-blue-600 font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveIndex(6)}
        >
          <Users className="h-5 w-5" />
          <span>Quản lý người dùng</span>
        </Link>
        <Link
          to="/admin/policies/"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeIndex === 7 ? 'text-white bg-blue-600 font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          onClick={() => setActiveIndex(7)}
        >
          <FileText className="h-5 w-5" />
          <span>Quản lý chính sách</span>
        </Link>
      </nav>

      {/* Admin Profile - Cố định ở dưới cùng */}
      <div className="p-2 border-t border-gray-700 bg-gray-900" ref={profileRef}>
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800 transition-colors group"
          >
            <img
              className="h-8 w-8 rounded-full border-2 border-gray-600 group-hover:border-gray-500"
              src={adminInfo.avatar}
              alt={adminInfo.name}
            />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">{adminInfo.name}</p>
              <p className="text-xs text-gray-400 truncate">{adminInfo.role}</p>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
              <div className="p-3 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={adminInfo.avatar}
                    alt={adminInfo.name}
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{adminInfo.name}</p>
                    <p className="text-xs text-gray-400">{adminInfo.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-1">
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Thông tin cá nhân</span>
                </Link>
                <Link
                  to="/admin/settings"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Cài đặt</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;