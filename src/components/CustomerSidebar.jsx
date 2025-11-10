import { Link, useLocation } from 'react-router-dom';
import {
    ReceiptText,
    UserIcon,
    Calendar,
    Heart,
    Ticket,
    ChevronDownIcon,
    ChevronUpIcon
} from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const CustomerSidebar = () => {

    const location = useLocation();

    const { user } = useSelector(state => state.auth);

    const [activeIndex, setActiveIndex] = useState(location.pathname);

    const shouldDropdownBeOpen = location.pathname.startsWith('/customer/account')
        || location.pathname.startsWith('/customer/address')
        || location.pathname.startsWith('/customer/changepassword');

    const [isOpen, setIsOpen] = useState(shouldDropdownBeOpen);

    const isActive = (path) => {
        return location.pathname === path;
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="max-w-md h-full ml-10 my-2.5 bg-white rounded-sm shadow-sm border border-gray-200 p-5">
            <div className="flex items-center space-x-3 mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">TH</span>
                </div>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900">{user.fullName}</h1>
                    <div className="flex items-center space-x-2 mt-1">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-600">{user.email}</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="space-y-1">
                <Link
                    to='/customer/account'
                    className={`flex items-center justify-between p-3 rounded-sm cursor-pointer
                         ${shouldDropdownBeOpen
                            ? 'bg-blue-50 text-blue-600 font-medium border-blue-600'
                            : 'hover:bg-gray-100 text-gray-700'}`}
                    onClick={() => {
                        if (!isOpen) {
                            toggleDropdown();
                        }
                    }}
                >
                    <div className={`flex items-center space-x-3`}>
                        <UserIcon className="w-5 h-5" />
                        <span>Thông tin tài khoản</span>
                        {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                    </div>
                </Link>

                {isOpen && (
                    <div className="mt-1 ml-7 space-y-1.5">
                        <Link
                            to='/customer/account'
                            className={`
                        block p-2 rounded cursor-pointer transition-colors duration-200
                        ${isActive('/customer/account')
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }
                    `}
                        >
                            Hồ sơ cá nhân
                        </Link>
                        <Link
                            to='/customer/address'
                            className={`
                        block p-2 rounded cursor-pointer transition-colors duration-200
                        ${isActive('/customer/address') || isActive('/customer/address/new')
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }
                    `}
                        >
                            Sổ địa chỉ
                        </Link>
                        <Link
                            to='/customer/changepassword'
                            className={`
                        block p-2 rounded cursor-pointer transition-colors duration-200
                        ${isActive('/customer/changepassword')
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }
                    `}
                        >
                            Đổi mật khẩu
                        </Link>
                    </div>
                )}

                <Link
                    to={'/customer/orders'}
                    className={`flex items-center space-x-3 p-3 rounded-sm cursor-pointer
                ${isActive('/customer/orders')
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                    onClick={() => {
                        if (isOpen) {
                            toggleDropdown();
                        }
                    }}
                >
                    <ReceiptText className="w-5 h-5" />
                    <span>Đơn hàng của tôi</span>
                </Link>

                <Link
                    to={'/customer/rentals'}
                    className={`flex items-center space-x-3 p-3 rounded-sm cursor-pointer
                ${isActive('/customer/rentals')
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                >
                    <Calendar className="w-5 h-5" />
                    <span>Sách đã thuê</span>
                </Link>

                <Link
                    to={'/customer/vouchers'}
                    className={`flex items-center space-x-3 p-3 rounded-sm cursor-pointer
                ${isActive('/customer/vouchers')
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                >
                    <Ticket className="w-5 h-5" />
                    <span>Ví Voucher</span>
                </Link>

                <Link
                    to={'/customer/wishlist'}
                    className={`flex items-center space-x-3 p-3 rounded-sm cursor-pointer
                ${isActive('/customer/wishlist')
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                >
                    <Heart className="w-5 h-5" />
                    <span>Danh sách yêu thích</span>
                </Link>
            </div>
        </div>
    );
}

export default CustomerSidebar
