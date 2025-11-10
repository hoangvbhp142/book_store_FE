import { useEffect, useState } from 'react'
import { Eye, EyeOff, Mail, MessageCircleMore } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, loginState, otp, register, registerState, setError } from '../stores/authSlice.js';
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
        otp: ''
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
        const { email, password, otp } = authData;
        let fullName = ' ';
        let phone = ' ';

        if (authScreenState === "login") {
            const result = await dispatch(login({ email, password })).unwrap();

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
            if (mode === 'admin' && user.role !== 'Admin') {
                dispatch(setError("Thông tin đăng nhập không chính xác"));
                return;
            }

            if (mode === 'customer' && user.role === 'Admin') {
                dispatch(setError("Thông tin đăng nhập không chính xác"));
                return;
            }

            localStorage.setItem('token', user.role === 'Admin' ? 'admin-token' : 'customer-token');
            navigate(user.role === "Admin" ? "/admin" : "/");
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
        <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {(otpLoading || authLoading) && <Loading message='đang xử lý' />}
            <div className="max-w-md w-full space-y-8">
                <div>
                    {authScreenState === "forgot_password" ? (
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">KHÔI PHỤC MẬT KHẨU</h2>
                    ) : (
                        <ul className="flex border-b border-gray-200 mb-8">
                            <li className="-mb-px mr-1">
                                <button className={`inline-block px-4 py-2 text-sm font-medium ${authScreenState === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
                                    onClick={() => setAuthScreenState("login")}
                                >Đăng nhập</button>
                            </li>
                            <li className={`-mb-px mr-1 ${mode === 'admin' ? 'hidden' : ''}`}>
                                <button className={`inline-block px-4 py-2 text-sm font-medium ${authScreenState === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
                                    onClick={() => setAuthScreenState("register")}
                                >Đăng ký</button>
                            </li>
                        </ul>
                    )}
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="form_register space-y-6">
                        <form action="" className="space-y-4" onSubmit={e => handleSubmit(e)}>
                            <div>
                                <label htmlFor="register-phone-email" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại/Email</label>
                                <input
                                    name='email'
                                    value={authData.email}
                                    onChange={handleAuthDataChange}
                                    required
                                    type="text"
                                    id="register-phone-email"
                                    placeholder="Nhập số điện thoại hoặc email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
                                {sent && <p className="text-green-500 text-sm">Mã OTP đã được gửi qua {method.toUpperCase()}</p>}
                            </div>
                            <p className={`${authScreenState === 'login' || sent ? 'hidden' : ''} text-sm`} >
                                Chọn phương thức xác minh OTP
                            </p>
                            <div className={`grid grid-cols-2 gap-4 ${authScreenState === 'login' || sent ? 'hidden' : ''}`} >
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleSendOtp('sms');
                                    }}
                                    className="flex items-center gap-1 px-3 py-2 text-sm text-blue-500 font-medium rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap cursor-pointer">
                                    <MessageCircleMore />
                                    Tin nhắn SMS
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        handleSendOtp('email');
                                    }}
                                    className="flex items-center gap-1 px-3 py-2 text-sm text-blue-500 font-medium rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap cursor-pointer">
                                    <Mail />
                                    Email
                                </button>
                            </div>

                            <div className={`${authScreenState === 'login' ? 'hidden' : ''}`}>
                                <label htmlFor="register-otp" className="block text-sm font-medium text-gray-700 mb-1">Mã xác nhận OTP</label>
                                <div className="relative">
                                    <input
                                        name='otp'
                                        value={authData.otp}
                                        onChange={handleAuthDataChange}
                                        required={authScreenState !== 'login'}
                                        type="text"
                                        id="register-otp"
                                        placeholder="Nhập mã xác nhận OTP"
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                {sent ? (
                                    <div className='mt-2 flex items-center gap-2 justify-end'>
                                        {
                                            countdown > 0 ? (
                                                <p className='text-sm text-blue-600'>Vui lòng chờ {countdown}s để gửi lại</p>) : (
                                                <button onClick={() => handleSendOtp(method)} className="flex items-center gap-1 px-3 py-2 text-sm text-blue-500 font-medium rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap cursor-pointer">
                                                    Gửi lại mã OTP
                                                </button>
                                            )
                                        }
                                        <button onClick={() => dispatch(resetOtp())} className="flex items-center gap-1 px-3 py-2 text-sm text-blue-500 font-medium rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap cursor-pointer">
                                            Phương thức khác
                                        </button>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div>
                                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                                <div className="relative">
                                    <input
                                        name='password'
                                        value={authData.password}
                                        onChange={handleAuthDataChange}
                                        required
                                        type={`${showPassword ? 'text' : 'password'}`}
                                        id="register-password"
                                        placeholder="Nhập mật khẩu"
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400">
                                        {
                                            showPassword ? <EyeOff className="h-5 w-5" onClick={() => setShowPassword(false)} /> : <Eye className="h-5 w-5" onClick={() => setShowPassword(true)} />
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className={`bg-red-50 border border-red-200 rounded-md p-3 mb-4 ${error ? '' : 'hidden'}`}>
                                <p className="text-sm text-red-700 flex items-center">
                                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </p>
                            </div>
                            <div className={`flex justify-end ${authScreenState === 'login' ? '' : 'hidden'}`} onClick={() => setAuthScreenState('forgot_password')}>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">Quên mật khẩu?</a>
                            </div>
                            <div>
                                {
                                    authScreenState === 'forgot_password' ? (
                                        <div className='flex flex-col gap-4'>
                                            <div className="space-y-3">
                                                <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                    type='submit'>
                                                    <span>Xác nhận</span>
                                                </button>
                                                <button className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                    type='button'
                                                    onClick={() => setAuthScreenState('login')}>
                                                    <span>Quay lại</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                            type='submit'>
                                            <span>{authScreenState === 'login' ? "Đăng nhập" : "Đăng ký"}</span>
                                        </button>
                                    )
                                }
                            </div>
                            <div className={`text-center text-xs text-gray-600 ${authScreenState === 'register' ? '' : 'hidden'}`}>
                                "Bằng việc đăng ký, bạn đã đồng ý với Book Store về"
                                <br />
                                <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a>
                                &nbsp;và&nbsp;
                                <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default Login
