import React, { useState, useEffect, useRef } from 'react'
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
import { logoutState } from '../stores/authSlice.js'
import { fetchBooks } from '../stores/bookSlice.js';
import bookApi from '../api/bookApi.js';
import { formatCurrency } from '../app/utils.js';

const Header = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const searchRef = useRef(null)
  const searchInputRef = useRef(null)
  const mobileSearchRef = useRef(null)

  const { items } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false)
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setMobileSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Hàm tìm kiếm sách với API - GỌI TRỰC TIẾP, KHÔNG QUA REDUX
  const searchBooks = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchDropdown(false)
      return
    }

    setIsSearching(true)

    try {
      // Gọi API trực tiếp thay vì qua Redux
      const response = await bookApi.getAll({
        q: query,
        page: 1,
        limit: 5,
        sort: 'name:asc',
        filter: JSON.stringify({ status: "PUBLISHED" })
      }, false);

      const result = response.data // Lấy data từ response

      console.log(result);


      if (result && result.length > 0) {
        const formattedResults = result.map(book => {
          // Lấy tên tác giả từ bookAuthors
          let authorNames = 'Chưa rõ tác giả'
          if (book.bookAuthors && book.bookAuthors.length > 0) {
            authorNames = book.bookAuthors
              .map(ba => ba.author?.name)
              .filter(Boolean)
              .join(', ')
          } else if (book.author) {
            authorNames = book.author
          }

          return {
            id: book.id,
            title: book.name || book.title,
            author: authorNames,
            sellerPrice: book.sellerPrice || book.price || 0,
            photoUrl: book.photoUrl || book.imageUrl || book.image,
            slug: book.slug || `${book.id}`
          }
        })
        setSearchResults(formattedResults)
        setShowSearchDropdown(true)

        console.log(formattedResults);

      } else {
        setSearchResults([])
        setShowSearchDropdown(true)
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error)
      setSearchResults([])
      setShowSearchDropdown(false)
    } finally {
      setIsSearching(false)
    }
  }

  // Debounce cho tìm kiếm
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchBooks(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery]) // Bỏ dispatch khỏi dependencies

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchFocus = () => {
    if (searchQuery.trim() && searchResults.length > 0) {
      setShowSearchDropdown(true)
    }
  }

  const handleProductClick = (productSlug) => {
    navigate(`/book/${productSlug}`)
    setShowSearchDropdown(false)
    setMobileSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleViewAllResults = () => {
    const currentParams = new URLSearchParams(window.location.search)
    currentParams.set('q', searchQuery)
    currentParams.set('search_from', 'header')

    navigate(`/search?${currentParams.toString()}`)
    setShowSearchDropdown(false)
    setMobileSearchOpen(false)
  }

  const handleLogout = () => {
    dispatch(logoutState())
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userData')
    navigate("/")
  }

  // Xử lý URL hình ảnh
  const getImageUrl = (photoUrl, title) => {
    if (photoUrl) {
      return photoUrl.replace('http://minio:9000', 'http://localhost:9000')
    }
    const initial = title ? title.substring(0, 2).toUpperCase() : 'BK'
    return `https://via.placeholder.com/60x80/3498db/ffffff?text=${encodeURIComponent(initial)}`
  }


  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Logo container với tỷ lệ phù hợp */}
          <div className="h-8 w-auto sm:h-20 flex items-center justify-center">
            <img
              src={"/logo.svg"}
              alt="Bookhaven Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </Link>


        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {[
            { to: "/", label: "Trang chủ" },
            { to: "/store", label: "Cửa hàng" },
            { to: "/about", label: "Giới thiệu" },
            { to: "/contact", label: "Liên hệ" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar (Desktop & Tablet) */}
        <div className="hidden md:block md:flex-1 md:max-w-xs lg:max-w-md xl:max-w-lg mx-4 lg:mx-6" ref={searchRef}>
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm sách, tác giả..."
              className="w-full pl-3 md:pl-4 pr-9 md:pr-10 py-2 md:py-2.5 text-xs md:text-sm border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
                 bg-gray-50/70 transition-all duration-200 placeholder:text-gray-400"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
            />
            <SearchIcon className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400 pointer-events-none" />

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 
                      rounded-lg shadow-lg max-h-[70vh] md:max-h-96 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {isSearching ? (
                  <div className="p-4 md:p-6 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-2 border-gray-300 border-t-blue-600"></div>
                    <p className="mt-2 md:mt-3 text-xs md:text-sm">Đang tìm kiếm...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="px-3 md:px-4 py-2 md:py-2.5 text-[10px] md:text-xs font-medium text-gray-500 bg-gray-50 border-b sticky top-0 z-1">
                      Tìm thấy <span className="text-blue-600 font-semibold">{searchResults.length}</span> kết quả
                    </div>
                    <div className="divide-y divide-gray-100">
                      {searchResults.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center gap-2 md:gap-3 p-2 md:p-3 hover:bg-blue-50/50 cursor-pointer 
                             transition-colors duration-150 group"
                          onClick={() => handleProductClick(book.slug)}
                        >
                          <div className="relative flex-shrink-0">
                            <img
                              src={getImageUrl(book.photoUrl, book.title)}
                              alt={book.title}
                              className="w-10 h-14 md:w-12 md:h-16 object-cover rounded border border-gray-200 
                                 group-hover:shadow-md transition-shadow duration-150"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/60x80/3498db/ffffff?text=BK`;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs md:text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 
                                   transition-colors duration-150">
                              {book.title}
                            </h4>
                            <p className="text-[10px] md:text-xs text-gray-500 truncate mt-0.5">{book.author}</p>
                            <p className="text-xs md:text-sm font-semibold text-blue-600 mt-0.5 md:mt-1">
                              {formatCurrency(book.sellerPrice)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="w-full p-2 md:p-3 text-center text-xs md:text-sm font-medium text-blue-600 
                         hover:bg-blue-50 cursor-pointer border-t border-gray-200
                         transition-colors duration-150 sticky bottom-0 bg-white"
                      onClick={handleViewAllResults}
                    >
                      Xem tất cả kết quả →
                    </button>
                  </>
                ) : searchQuery.trim() ? (
                  <div className="p-6 md:p-8 text-center text-gray-500">
                    <div className="text-3xl md:text-4xl mb-2">📚</div>
                    <p className="text-xs md:text-sm font-medium">Không tìm thấy sách phù hợp</p>
                    <p className="text-[10px] md:text-xs text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search (Mobile) */}
          <button
            className="md:hidden p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setMobileSearchOpen(true)}
          >
            <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            className="relative p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition"
          >
            <ShoppingCartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-blue-600 text-white text-[10px] sm:text-xs font-medium rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center leading-none">
                {items.length}
              </span>
            )}
          </button>

          {/* User Menu */}
          {user ? (
            <div className="relative group">
              <button className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition">
                <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px]">{user.fullName}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  {[
                    { to: '/customer/account', icon: UserIcon, label: 'Thông tin cá nhân' },
                    { to: '/customer/orders', icon: ReceiptText, label: 'Đơn hàng của tôi' },
                    { to: '/customer/rentals', icon: Calendar, label: 'Yêu cầu trả sách thuê' },
                  ].map(({ to, icon: Icon, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>{label}</span>
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left transition"
                  >
                    <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:text-blue-600 hover:border-blue-400 transition whitespace-nowrap"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-gray-100 bg-white overflow-x-auto">
        <div className="flex px-3 sm:px-4 py-2 gap-2 sm:gap-3 min-w-max">
          {[
            { to: "/", label: "Trang chủ" },
            { to: "/store", label: "Cửa hàng" },
            { to: "/about", label: "Giới thiệu" },
            { to: "/contact", label: "Liên hệ" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex-shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200">
          <div
            ref={mobileSearchRef}
            className="bg-white rounded-b-2xl shadow-2xl animate-in slide-in-from-top duration-300"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Tìm sách, tác giả..."
                    className="w-full pl-4 pr-10 py-3 text-sm border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
                       bg-gray-50/70 transition-all duration-200 placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    autoFocus
                  />
                  <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mobile Search Results */}
            <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
              {isSearching ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
                  <p className="mt-3 text-sm">Đang tìm kiếm...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="px-4 py-2.5 text-xs font-medium text-gray-500 bg-gray-50 border-b sticky top-0">
                    Tìm thấy <span className="text-blue-600 font-semibold">{searchResults.length}</span> kết quả
                  </div>
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((book) => (
                      <div
                        key={book.id}
                        className="flex items-center gap-3 p-4 hover:bg-blue-50/50 active:bg-blue-100/50 cursor-pointer 
                           transition-colors duration-150"
                        onClick={() => handleProductClick(book.slug)}
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={getImageUrl(book.photoUrl, book.title)}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded border border-gray-200"
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/60x80/3498db/ffffff?text=BK`;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {book.title}
                          </h4>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{book.author}</p>
                          <p className="text-sm font-semibold text-blue-600 mt-1">
                            {book.sellerPrice?.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="w-full p-4 text-center text-sm font-medium text-blue-600 
                       hover:bg-blue-50 active:bg-blue-100 cursor-pointer border-t border-gray-200
                       transition-colors duration-150 sticky bottom-0 bg-white"
                    onClick={handleViewAllResults}
                  >
                    Xem tất cả kết quả →
                  </button>
                </>
              ) : searchQuery.trim() ? (
                <div className="p-12 text-center text-gray-500">
                  <div className="text-5xl mb-3">📚</div>
                  <p className="text-sm font-medium">Không tìm thấy sách phù hợp</p>
                  <p className="text-xs text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <SearchIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nhập từ khóa để tìm kiếm</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header