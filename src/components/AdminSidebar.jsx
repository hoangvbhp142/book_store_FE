import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
  Ticket,
  Image,
  Calendar
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutState } from '../stores/authSlice';

const AdminSidebar = () => {

  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const menuItems = [
    { url: "/admin", label: "Tổng quan", index: 1, icon: <LayoutDashboard className="h-5 w-5" /> },
    { url: "/admin/books", label: "Quản lý sách", index: 2, icon: <BookOpen className="h-5 w-5" /> },
    { url: "/admin/categories", label: "Quản lý danh mục", index: 3, icon: <WalletCards className="h-5 w-5" /> },
    { url: "/admin/authors", label: "Quản lý tác giả", index: 4, icon: <UserPen className="h-5 w-5" /> },
    { url: "/admin/publishers", label: "Quản lý nhà xuất bản", index: 5, icon: <Building className="h-5 w-5" /> },
    // { url: "/admin/vouchers", label: "Quản lý voucher", index: 6, icon: <Ticket className="h-5 w-5" /> },
    { url: "/admin/orders", label: "Quản lý đơn hàng", index: 7, icon: <Package className="h-5 w-5" /> },
    { url: "/admin/rentals", label: "Quản lý sách thuê", index: 8, icon: <Clock className="h-5 w-5" /> },
    { url: "/admin/returns", label: "Quản lý yêu cầu trả sách", index: 12, icon: <Calendar className="h-5 w-5" /> },
    { url: "/admin/users", label: "Quản lý người dùng", index: 9, icon: <Users className="h-5 w-5" /> },
    { url: "/admin/policies", label: "Quản lý chính sách", index: 10, icon: <FileText className="h-5 w-5" /> },
    { url: "/admin/banners", label: "Quản lý banner", index: 11, icon: <Image className="h-5 w-5" /> },
  ];

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

    window.location.href = '/admin/login'
  };

  const adminInfo = {
    name: 'Admin User',
    email: 'admin@bookhaven.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Super Admin'
  };

  return (
    <div className="w-65 flex-shrink-0 bg-gray-900 border-r border-gray-700 overflow-hidden flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-700">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="text-xl font-serif font-bold text-white">BookHaven Panel</div>
        </Link>
      </div>

      {/* Navigation - Chiếm không gian còn lại */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {
          menuItems.map((item, i) => {

            return (
              <NavLink
                key={item.index}
                to={item.url}
                end={item.url === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive
                    ? "text-white bg-blue-600 font-medium"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>

            )
          })
        }
      </nav>

      {/* Admin Profile - Cố định ở dưới cùng */}
      <div className="p-2 border-t border-gray-700 bg-gray-900" ref={profileRef}>
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800 transition-colors group"
          >
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">
                {user.fullName
                  ?.split(" ")
                  .map(word => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
            </div>

            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
              <p className="text-xs text-gray-400 truncate">{user.role}</p>
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
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {user.fullName
                        ?.split(" ")
                        .map(word => word[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">{user.fullName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
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