import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Upload,
    BookOpen,
    Tag,
    DollarSign,
    Image as ImageIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';

const ModifyBookForm = ({ isEdit = false, bookData = null, onSubmit }) => {

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        publisher: '',
        publishYear: null,
        salePrice: null,
        rentalPrice: null,
        discountPrice: null,
        quantity: null,
        status: true,
        popular: false,
        isbn: '',
        pageCount: null,
        language: '',
        coverType: '',
        weight: null,
        dimensions: '',
        category: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevDate) => ({
            ...prevDate,
            [name]: type === 'checkbox' ? checked : value,
        }))
    };

    useEffect(() => {
        if (isEdit && bookData) {
            setFormData(bookData);
        }
    }, [isEdit, bookData]);

    console.log(formData);

    return (


        <div className="bg-white shadow-sm rounded-2xl p-8 border border-gray-100">
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
                                    name='title'
                                    value={formData.title}
                                    onChange={handleChange}
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
                                    name='author'
                                    value={formData.author}
                                    onChange={handleChange}
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
                                    name='publisher'
                                    value={formData.publisher}
                                    onChange={handleChange}
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
                                    name='publishYear'
                                    value={formData.publishYear}
                                    onChange={handleChange}
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
                                    name='salePrice'
                                    value={formData.salePrice}
                                    onChange={handleChange}
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
                                    name='discountPrice'
                                    value={formData.discountPrice}
                                    onChange={handleChange}
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
                                    name='rentalPrice'
                                    value={formData.rentalPrice}
                                    onChange={handleChange}
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
                                    name='quantity'
                                    value={formData.quantity}
                                    onChange={handleChange}
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
                                    name='status'
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    defaultChecked={isEdit ? formData.status : true}
                                />
                                <label className="font-medium text-gray-700 cursor-pointer" htmlFor="status">
                                    Đang hoạt động <span className="text-red-500">*</span>
                                </label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="popular"
                                    name='popular'
                                    value={formData.popular}
                                    onChange={handleChange}
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
                                    name='isbn'
                                    value={formData.isbn}
                                    onChange={handleChange}
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
                                    name='pageCount'
                                    value={formData.pageCount}
                                    onChange={handleChange}
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
                                    name='language'
                                    value={formData.language}
                                    onChange={handleChange}
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
                                    name='coverType'
                                    value={formData.coverType}
                                    onChange={handleChange}
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
                                    name='weight'
                                    value={formData.weight}
                                    onChange={handleChange}
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
                                    name='dimensions'
                                    value={formData.dimensions}
                                    onChange={handleChange}
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
                                    name='category'
                                    value={formData.category}
                                    onChange={handleChange}
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
                                name='description'
                                value={formData.description}
                                onChange={handleChange}
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
        </div>
    );
}
export default ModifyBookForm;