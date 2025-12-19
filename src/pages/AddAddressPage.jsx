import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { create, getById, update } from '../stores/addressSlice';
import { getDiff } from '../app/utils';
const AddAddressPage = () => {

    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { currentAddress, error, loading } = useSelector(state => state.address);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        label: '',
        province: '',
        district: '',
        ward: '',
        street: '',
        postalCode: '',
        isDefault: false
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);


    const handleChangeAddressData = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    useEffect(() => {
        if (isEdit) {
            dispatch(getById(id));
        }
    }, [isEdit, id, dispatch]);

    useEffect(() => {
        if (isEdit && currentAddress) {
            setFormData({
                name: currentAddress.name || '',
                phone: currentAddress.phone || '',
                label: currentAddress.label || '',
                province: currentAddress.province || '',
                district: currentAddress.district || '',
                ward: currentAddress.ward || '',
                street: currentAddress.street || '',
                postalCode: currentAddress.postalCode || '',
                isDefault: currentAddress.isDefault || false,
            });
        }
    }, [currentAddress, isEdit]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEdit) {
            try {
                const result = await dispatch(update({ id, payload: getDiff(currentAddress, formData) })).unwrap();
                toast.success('Cập nhật địa chỉ mới thành công');
            } catch (error) {
                console.log(error);
                toast.error(error);
            }
        } else {
            try {
                const result = await dispatch(create(formData)).unwrap();
                toast.success('Thêm địa chỉ mới thành công');
            } catch (error) {
                console.log(error);
                toast.error(error);
            }
        }

        // Điều hướng về danh sách địa chỉ
        navigate('/customer/address');
    }

    return (
        <div className="bg-white p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {isEdit ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </h1>

            <form className="space-y-3" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Họ và tên<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        name='name'
                        onChange={handleChangeAddressData}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.phone}
                        name='phone'
                        onChange={handleChangeAddressData}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Tỉnh/Thành <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.province}
                            name='province'
                            onChange={handleChangeAddressData}
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Quận/Huyện <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.district}
                            name='district'
                            onChange={handleChangeAddressData}
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Xã/Phường <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.ward}
                            name='ward'
                            onChange={handleChangeAddressData}
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Địa chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.street}
                        name='street'
                        onChange={handleChangeAddressData}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Ghi chú
                    </label>
                    <input
                        type="text"
                        value={formData.label}
                        name='label'
                        onChange={handleChangeAddressData}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div className='invisible'>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Mã bưu điện
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                    <input
                        type="checkbox"
                        checked={formData.isDefault}
                        name='isDefault'
                        onChange={handleChangeAddressData}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                    <label className="text-sm text-gray-700">Sử dụng làm Địa chỉ mặc định</label>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                    <button
                        onClick={() => navigate('/customer/address')}
                        type="button"
                        className="w-full md:w-auto px-3 py-2 border border-gray-300 bg-gray-50 text-gray-700 font-medium rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="w-full md:w-auto px-3 py-2 bg-blue-600 text-white font-medium rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Lưu địa chỉ
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddAddressPage
