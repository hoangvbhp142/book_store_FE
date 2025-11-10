import { Link, useNavigate } from 'react-router-dom';
import {
    LogOut,
    User
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutState } from '../stores/authSlice';

const AdminHeader = () => {
    const naviagate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutState());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");

        //naviagate('/login');
        window.location.href = '/admin/login';
    }

    return (
        <header className="top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
            <div className="flex h-15 items-center justify-end px-4">
                <div className="relative group">
                    <button className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">Admin</span>
                    </button>

                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <Link
                            to="/admin/profile"
                            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <User className="h-4 w-4" />
                            Thông tin cá nhân
                        </Link>
                        <button className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 border-t border-gray-100"
                            onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </header>

    );
}
export default AdminHeader;