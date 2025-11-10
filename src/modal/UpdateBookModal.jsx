import React from 'react'

const UpdateBookModal = ({onSubmit, onClose}) => {

    return (
        <form className="space-y-8">
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Thông tin cơ bản</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Book Cover Image <span className="text-red-500">*</span>
                        </label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-gray-50">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900">Upload a cover image</p>
                                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-1 space-y-4">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Tên sách <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập tên sách"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Tác giả <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập tên tác giả"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-1 space-y-4">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Nhà xuất bản <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập tên nhà xuất bản"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Năm xuất bản <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Nhập năm xuất bản"
                                min="1900"
                                max="2025"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Giá cả & Số lượng</h2>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Giá bán (VND) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Nhập giá bán"
                                min="0"
                                step="1000"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Giá khuyến mãi (VND)
                            </label>
                            <input
                                type="number"
                                placeholder="Nhập giá khuyến mãi"
                                min="0"
                                step="1000"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Giá thuê/tháng (VND) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Nhập giá thuê"
                                min="0"
                                step="1000"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Số lượng <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Nhập số lượng"
                                min="0"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="status"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                defaultChecked={true}
                            />
                            <label className="font-medium text-gray-700 cursor-pointer" htmlFor="status">
                                Đang hoạt động <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="popular"
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label className="font-medium text-gray-700 cursor-pointer" htmlFor="popular">
                                Sản phẩm nổi bật
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Thông tin chi tiết</h2>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                ISBN <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập ISBN"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Số trang <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Nhập số trang"
                                min="1"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Ngôn ngữ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ví dụ: Tiếng Việt"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Loại bìa <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ví dụ: Bìa mềm"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Trọng lượng (g) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Nhập trọng lượng"
                                min="0"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Kích thước <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ví dụ: 15x20 cm"
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            >
                                <option value="">Chọn thể loại</option>
                                <option value="fiction">Viễn tưởng</option>
                                <option value="romance">Lãng mạn</option>
                                <option value="mystery">Huyền bí</option>
                                <option value="fantasy">Thế giới giả tưởng</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium text-gray-700 mb-2">Mô tả</label>
                        <textarea
                            rows={4}
                            placeholder="Nhập mô tả chi tiết về sách..."
                            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-colors"
                        ></textarea>
                    </div>
                </div>
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-8 py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                >
                    Thêm Sách
                </button>
            </div>
        </form>
    )
}

export default UpdateBookModal
