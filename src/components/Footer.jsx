import React from 'react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900">BookHaven</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              BookHaven nhận đặt hàng trực tuyến và giao hàng tận nơi. KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng cũng như tất cả Hệ Thống BookHaven trên toàn quốc.
            </p>
          </div>

          {/* Services Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">DỊCH VỤ</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Chính sách bảo vệ thông tin cá nhân
                </a>
              </li>
              <li>
                <a href="/payment-policy" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Chính sách bảo mật thanh toán
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Giới thiệu về BookHaven
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">HỖ TRỢ</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/return-policy" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Chính sách đổi trả - hoàn tiền
                </a>
              </li>
              <li>
                <a href="/rental-policy" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Chính sách cho thuê
                </a>
              </li>
              <li>
                <a href="/shipping-policy" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a href="/wholesale-policy" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Chính sách khách sỉ
                </a>
              </li>
            </ul>
          </div>

          {/* Account Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">TÀI KHOẢN CỦA TÔI</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/login" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Đăng nhập/Tạo mới tài khoản
                </a>
              </li>
              <li>
                <a href="/address" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Thay đổi địa chỉ khách hàng
                </a>
              </li>
              <li>
                <a href="/account" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Chi tiết tài khoản
                </a>
              </li>
              <li>
                <a href="/order-history" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Lịch sử mua hàng
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">&copy; 2025 BookHaven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;