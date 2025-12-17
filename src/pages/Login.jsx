import { useEffect, useState } from 'react'
import { Eye, EyeOff, Mail, MessageCircleMore } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, otp, register, setError } from '../stores/authSlice.js';
import { resetOtp, sendOtp, sendOtpState, setCountdown } from '../stores/otpSlice.js';
import Loading from '../components/Loading.jsx';
import { toast } from 'react-toastify';

const Login = ({ mode }) => {

    const dispatch = useDispatch();
    const { user, error, loading: authLoading } = useSelector(state => state.auth);
    const { loading: otpLoading, method, sent, countdown, error: otpError } = useSelector(state => state.otp);

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [authScreenState, setAuthScreenState] = useState("login");

    const [authData, setAuthData] = useState({
        email: '',
        password: '',
        otp: '',
        fullName: '',
        phone: ''
    });

    const handleAuthDataChange = (e) => {
        const { name, value } = e.target;
        setAuthData({
            ...authData,
            [name]: value
        });
        if (error) {
            dispatch(setError(null));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, otp, fullName, phone } = authData;

        if (authScreenState === "login") {
            const result = await dispatch(login({ email, password })).unwrap();

            console.log(result);

            if ((mode === 'admin' && result.role !== 'ADMIN') || (mode === 'customer' && result.role !== 'USER')) {
                dispatch(setError("Thông tin đăng nhập không chính xác"));
                return;
            }

            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('userData', JSON.stringify({
                fullName: result.fullName,
                email: result.email,
                phone: result.phone,
                role: result.role
            }));
            console.log(result);

            if ((mode === 'admin')) {
                navigate("/admin");
            }
            else {
                navigate("/");
            }

            toast.success("Đăng nhập thành công");
        }
        else if (authScreenState === "register" && mode !== 'admin') {
            const result = await dispatch(register({ email, password, otp, fullName, phone })).unwrap();

            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('userData', JSON.stringify({
                fullName: result.fullName,
                email: result.email,
                phone: result.phone,
                role: result.role
            }));
            console.log(result);

            navigate("/");

            toast.success("Đăng ký thành công");
        }
        else {
            console.log('hello');
        }
    }

    const handleSendOtp = (method) => {
        const { email } = authData;
        dispatch(sendOtp({ email }));
    }

    useEffect(() => {
        if (user) {
            console.log(user);
            
            if (mode === 'admin' && user.role !== 'ADMIN') {
                console.log("hể");
                
                dispatch(setError("Thông tin đăng nhập không chính xác"));
                return;
            }

            if (mode === 'customer' && user.role === 'ADMIN') {
                dispatch(setError("Thông tin đăng nhập không chính xác"));
                return;
            }

            localStorage.setItem('token', user.role === 'ADMIN' ? 'admin-token' : 'customer-token');
            navigate(user.role === "ADMIN" ? "/admin" : "/");
            // window.location.href = (user.role === "Admin" ? "/admin" : "/");
        }
    }, [user, mode, navigate, dispatch]);

    useEffect(() => {
        setAuthData({
            email: '',
            password: '',
            otp: ''
        });
        dispatch(setError(null));
        dispatch(resetOtp())
    }, [authScreenState, dispatch]);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                dispatch(setCountdown(countdown - 1));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div>
                    {authScreenState === "forgot_password" ? (
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                                Khôi phục mật khẩu
                            </h2>
                            <p className="text-sm text-gray-600">
                                Nhập email để nhận mã xác nhận
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-t-2xl shadow-sm">
                            <ul className="flex border-b border-gray-200">
                                <li className="flex-1">
                                    <button
                                        className={`w-full px-6 py-4 text-sm font-semibold transition-all duration-200 ${authScreenState === 'login'
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setAuthScreenState("login")}
                                    >
                                        Đăng nhập
                                    </button>
                                </li>
                                <li className={`flex-1 ${mode === 'admin' ? 'hidden' : ''}`}>
                                    <button
                                        className={`w-full px-6 py-4 text-sm font-semibold transition-all duration-200 ${authScreenState === 'register'
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setAuthScreenState("register")}
                                    >
                                        Đăng ký
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Form Container */}
                <div className={`bg-white shadow-xl ${authScreenState === "forgot_password" ? 'rounded-2xl' : 'rounded-b-2xl'} overflow-hidden`}>
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    value={authData.email}
                                    onChange={handleAuthDataChange}
                                    required
                                    type="email"
                                    id="email"
                                    placeholder="example@email.com"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                {otpError && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {otpError}
                                    </p>
                                )}
                                {sent && (
                                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Mã OTP đã được gửi qua {method.toUpperCase()}
                                    </p>
                                )}
                            </div>

                            {/* Register Additional Fields */}
                            {authScreenState === 'register' && (
                                <>
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên
                                        </label>
                                        <input
                                            name="fullName"
                                            value={authData.fullName}
                                            onChange={handleAuthDataChange}
                                            required
                                            type="text"
                                            id="fullName"
                                            placeholder="Nguyễn Văn A"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại
                                        </label>
                                        <input
                                            name="phone"
                                            value={authData.phone}
                                            onChange={handleAuthDataChange}
                                            required
                                            type="tel"
                                            id="phone"
                                            placeholder="0123456789"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </>
                            )}

                            {/* OTP Method Selection */}
                            <div className={`${authScreenState === 'login' || sent ? 'hidden' : ''}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        Phương thức xác minh:
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleSendOtp('email')}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 bg-white rounded-lg border border-blue-300 hover:bg-blue-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Gửi OTP qua Email
                                    </button>
                                </div>
                            </div>

                            {/* OTP Field */}
                            <div className={`${authScreenState === 'login' ? 'hidden' : ''}`}>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mã xác nhận OTP
                                </label>
                                <input
                                    name="otp"
                                    value={authData.otp}
                                    onChange={handleAuthDataChange}
                                    required={authScreenState !== 'login'}
                                    type="text"
                                    id="otp"
                                    placeholder="Nhập 6 chữ số"
                                    maxLength="6"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-widest text-center text-lg font-semibold"
                                />

                                {sent && (
                                    <div className="mt-3 flex flex-col sm:flex-row items-center gap-2 justify-end">
                                        {countdown > 0 ? (
                                            <p className="text-sm text-blue-600 font-medium">
                                                Gửi lại sau {countdown}s
                                            </p>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSendOtp(method)}
                                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-lg border border-blue-300 hover:bg-blue-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                            >
                                                Gửi lại mã
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => dispatch(resetOtp())}
                                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                                        >
                                            Phương thức khác
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        value={authData.password}
                                        onChange={handleAuthDataChange}
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm text-red-700 flex items-center gap-2">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span>{error}</span>
                                    </p>
                                </div>
                            )}

                            {/* Forgot Password Link */}
                            <div className={`flex justify-end ${authScreenState === 'login' ? '' : 'hidden'}`}>
                                <button
                                    type="button"
                                    onClick={() => setAuthScreenState('forgot_password')}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>

                            {/* Submit Buttons */}
                            <div className="space-y-3">
                                {authScreenState === 'forgot_password' ? (
                                    <>
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02]"
                                        >
                                            Xác nhận
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setAuthScreenState('login')}
                                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                                        >
                                            Quay lại
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02]"
                                    >
                                        {authScreenState === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                                    </button>
                                )}
                            </div>

                            {/* Terms & Conditions */}
                            <div className={`text-center ${authScreenState === 'register' ? '' : 'hidden'}`}>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Bằng việc đăng ký, bạn đã đồng ý với Book Store về
                                    <br />
                                    <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                                        Điều khoản dịch vụ
                                    </a>
                                    {' '}và{' '}
                                    <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                                        Chính sách bảo mật
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
