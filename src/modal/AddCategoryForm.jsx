import React, { useEffect, useState } from 'react'

const AddCategoryForm = ({ isEdit, onSubmit, onClose, categoryData, parentCategory }) => {

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        parentId: null,
        children: [],
        parentName: ''
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
        if (isEdit && categoryData) {
            setFormData(categoryData);
        }

        if (!isEdit && parentCategory) {
            setFormData({
                id: '',
                name: '',
                parentId: parentCategory.id,
                children: [],
                parentName: parentCategory.name
            })
        }
    }, [isEdit, categoryData]);

    return (
        <div className='p-3'>
            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Hiển thị breadcrumb phân cấp nếu là danh mục con */}
                {formData.parentId && (
                    <div className="flex items-center text-base text-gray-500 mb-2">
                        <span className="text-gray-400">Danh mục cha</span>
                        <span className="mx-2 text-gray-300">→</span>
                        <span className="font-medium text-blue-600">{formData.parentName}</span>
                    </div>
                )}

                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-2">
                        Tên danh mục <span className="text-red-500">*</span>
                    </label>

                    {/* Container với hiệu ứng phân cấp */}
                    <div className={`relative ${formData.parentId ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
                        {/* Hiển thị dấu phân cấp cho danh mục con */}
                        {formData.parentId && (
                            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                                <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                            </div>
                        )}

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={
                                formData.parentId
                                    ? "Nhập tên danh mục con (ví dụ: Sách tiếng Anh)"
                                    : "Nhập tên danh mục (ví dụ: Văn học)"
                            }
                            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors w-full"
                            required
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        {isEdit ? "Cập nhật danh mục" : "Thêm danh mục"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddCategoryForm
