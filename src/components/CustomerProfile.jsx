import React, { useEffect, useState } from 'react'
import { Package, Clock, CheckCircleIcon } from 'lucide-react'
import { useSelector } from 'react-redux'

const CustomerProfile = () => {

    const { user } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        fullName: '',
        role: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || '',
                phone: user.phone || '',
                fullName: user.fullName || '',
                role: user.role || ''
            });
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 p-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                            <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">12</p>
                            <p className="text-sm text-gray-600">Tổng số đơn hàng</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">2</p>
                            <p className="text-sm text-gray-600">Số sách đang thuê</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">20.000.000 đ</p>
                            <p className="text-sm text-gray-600">Đã thanh toán</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Hồ sơ cá nhân</h1>

                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span>Họ</span>
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                name='fullName'
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Nhập họ"
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span>Tên</span>
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                name='firstName'
                                placeholder="Nhập tên"
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span>Số điện thoại</span>
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Số điện thoại"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span>Email</span>
                        </label>
                        <input
                            type="text"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Chưa có email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <label className="block text-sm font-medium text-gray-700">
                            <span>Giới tính</span>
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Nam</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Nữ</span>
                        </label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <label className="block text-sm font-medium text-gray-700">
                            <span>Ngày sinh</span>
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            name="day"
                            placeholder="DD"
                            maxLength="2"
                            className="w-16 px-3 py-2 border border-gray-300 rounded-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                            type="text"
                            name="month"
                            placeholder="MM"
                            maxLength="2"
                            className="w-16 px-3 py-2 border border-gray-300 rounded-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                            type="text"
                            name="year"
                            placeholder="YYYY"
                            maxLength="4"
                            className="w-20 px-3 py-2 border border-gray-300 rounded-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-3 py-2 bg-blue-600 text-white font-medium rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Cập nhật thông tin
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CustomerProfile
