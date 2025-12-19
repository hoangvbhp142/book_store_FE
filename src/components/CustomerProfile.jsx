import React, { useEffect, useState } from 'react'
import { Package, Clock, CheckCircleIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import authApi from '../api/authApi';
import { getDiff } from '../app/utils';
import { updateProfile } from '../stores/authSlice';

const CustomerProfile = () => {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const validateForm = () => {
        if (!formData.fullName) {
            toast.error("Họ và tên không được để trống!");
            return false;
        }
        if (!formData.phone) {
            toast.error("Số điện thoại không được để trống!");
            return false;
        }
        return true;
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            await dispatch(updateProfile({
                fullName: formData.fullName,
                phone: formData.phone
            })).unwrap();
            toast.success("Cập nhật thành công!");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Cập nhật thất bại!");
        }
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
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Hồ sơ cá nhân</h1>

                <form className="space-y-6"
                    onSubmit={(e) => handleUpdateProfile(e)}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span>Họ và tên</span>
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
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
