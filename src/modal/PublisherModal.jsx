import React from 'react'
import { useState, useEffect } from 'react';

const PublisherModal = ({ isEdit, onSubmit, onClose, data }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        website: '',
        contactEmail: ''
    });

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    }

    useEffect(() => {
        if (isEdit && data) {
            setFormData(data);
        } else {
            // Reset form khi thêm mới
            setFormData({
                name: '',
                address: '',
                website: '',
                contactEmail: ''
            });
        }
    }, [isEdit, data]);

    return (
        <form className="space-y-6 p-5" onSubmit={handleSubmit}>
            <div>
                <label className="block text-lg font-medium text-gray-700 mb-3" htmlFor="name">
                    Tên nhà xuất bản
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    placeholder="Nhập tên nhà xuất bản"
                    required
                />
            </div>
            
            <div>
                <label className="block text-lg font-medium text-gray-700 mb-3" htmlFor="address">
                    Địa chỉ
                </label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-vertical"
                    placeholder="Nhập địa chỉ nhà xuất bản"
                    required
                />
            </div>

            <div>
                <label className="block text-lg font-medium text-gray-700 mb-3" htmlFor="website">
                    Website
                </label>
                <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    placeholder="https://example.com"
                />
            </div>

            <div>
                <label className="block text-lg font-medium text-gray-700 mb-3" htmlFor="contactEmail">
                    Email liên hệ
                </label>
                <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    placeholder="contact@example.com"
                    required
                />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="px-6 py-3 text-base font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                >
                    {isEdit ? 'Cập nhật' : 'Thêm'}
                </button>
            </div>
        </form>
    )
}

export default PublisherModal