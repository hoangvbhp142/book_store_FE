import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ReceiptText,
  BookOpenIcon,
  SearchIcon,
  HeartIcon,
  ShoppingCartIcon,
  LogOut,
  Calendar,
  UserIcon
} from "lucide-react"
import { useDispatch, useSelector } from 'react-redux';
import { logout, logoutState } from '../stores/authSlice.js'

const Header = () => {

  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const token = localStorage.getItem('accessToken');

  const handleLogout = async () => {
    dispatch(logoutState());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    navigate("/");
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpenIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-900">BookHaven</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { to: "/", label: "Trang chủ" },
            { to: "/store", label: "Cửa hàng" },
            { to: "/about", label: "Giới thiệu" },
            { to: "/contact", label: "Liên hệ" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:block flex-1 max-w-md mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm sách, tác giả, thể loại..."
              className="w-full pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/70"
            />
            <SearchIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search (Mobile) */}
          <button className="md:hidden p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition">
            <SearchIcon className="h-5 w-5" />
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-medium rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {items.length}
            </span>
          </button>

          {/* User Menu */}
          {user ? (
            <div className="relative group">
              <button className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition">
                <UserIcon className="h-5 w-5" />
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <div className="py-1">
                  {[
                    { to: '/customer/account', icon: UserIcon, label: 'Thông tin cá nhân' },
                    { to: '/customer/orders', icon: ReceiptText, label: 'Đơn hàng của tôi' },
                    { to: '/customer/rentals', icon: Calendar, label: 'Sách đã thuê' },
                    { to: '/customer/wishlist', icon: HeartIcon, label: 'Yêu thích' },
                  ].map(({ to, icon: Icon, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:text-blue-600 hover:border-blue-400 transition"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-100 bg-white">
        <div className="flex overflow-x-auto px-4 py-2 gap-3">
          {[
            { to: "/", label: "Trang chủ" },
            { to: "/store", label: "Cửa hàng" },
            { to: "/about", label: "Giới thiệu" },
            { to: "/contact", label: "Liên hệ" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>

  )
}

export default Header
