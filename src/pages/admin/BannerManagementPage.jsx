import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import bannerApi from '../../api/bannerApi';
import imageApi from '../../api/imageApi';
import { getDiff } from '../../app/utils';

const BannerManagementPage = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const positionOptions = [
        { title: "Trang chủ", position: "HOME_MAIN" },
        { title: "Trang chủ", position: "HOME_SUB" },
        { title: "Trang chủ", position: "HOME_MIDDLE" },
        { title: "Trang chủ", position: "HOME_BOTTOM" },
        { title: "Sidebar", position: "SIDEBAR_TOP" },
        { title: "Sidebar", position: "SIDEBAR_BOTTOM" },
        { title: "Danh mục sản phẩm", position: "CATEGORY_HEADER" },
        { title: "Chi tiết sản phẩm", position: "PRODUCT_DETAIL" },
        { title: "Giỏ hàng", position: "CART" }
    ];

    const [searchParams, setSearchParams] = useState({
        sort: "",
        q: "",
        limit: 20,
        page: 1
    });

    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        link: '',
        position: 'HOME_MAIN',
        sortOrder: 0,
        startDate: '',
        endDate: '',
        isActive: true
    });
    const [imagePreview, setImagePreview] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [imageFile, setImageFile] = useState(null);

    // Hàm format ngày tháng để hiển thị
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const handleAddNew = () => {
        setEditingBanner(null);
        setFormData({
            title: '',
            imageUrl: '',
            link: '',
            position: 'HOME_MAIN',
            sortOrder: 0,
            startDate: '',
            endDate: '',
            isActive: true
        });
        setImagePreview('');
        setImageFile(null);
        setUploadError('');
        setShowModal(true);
    };

    const handleEdit = (banner) => {
        console.log(banner);

        setEditingBanner(banner);
        setFormData({
            title: banner.title || '',
            imageUrl: banner.imageUrl || '',
            link: banner.link || '',
            position: banner.position || 'HOME_MAIN',
            sortOrder: banner.sortOrder || 0,
            startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
            endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
            isActive: banner.isActive !== undefined ? banner.isActive : true
        });

        setImagePreview(banner.imageUrl || '');
        setImageFile(null);
        setUploadError('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;

        try {
            await bannerApi.delete(id);
            setBanners(banners.filter(b => b.id !== id));
            toast.success('Xóa banner thành công');
        } catch (error) {
            console.error('Error deleting banner:', error);
            toast.error('Đã có lỗi xảy ra khi xóa banner');
        }
    };

    const handleToggleStatus = async (id) => {
        const banner = banners.find(b => b.id === id);
        if (!banner) return;

        const newStatus = !banner.isActive;

        try {
            await bannerApi.update(id, { isActive: newStatus });
            setBanners(banners.map(b =>
                b.id === id ? { ...b, isActive: newStatus } : b
            ));
            toast.success(`Đã ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} banner`);
        } catch (error) {
            console.error('Error updating banner status:', error);
            toast.error('Đã có lỗi xảy ra khi cập nhật trạng thái');
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        setUploadError('');
        setUploading(true);

        if (!file) {
            setUploading(false);
            return;
        }

        // Kiểm tra loại file
        if (!file.type.startsWith('image/')) {
            setUploadError('Vui lòng chọn file hình ảnh (JPEG, PNG, GIF)');
            setUploading(false);
            return;
        }
        console.log(file.size);

        // Tạo preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);

        // Lưu file để upload sau
        setImageFile(file);
        setUploading(false);
    };

    const removeImage = () => {
        setImagePreview('');
        setFormData(prev => ({ ...prev, imageUrl: '' }));
        setImageFile(null);
        setUploadError('');
    };

    const uploadImageToServer = async () => {
        if (!imageFile) {
            return editingBanner ? formData.imageUrl : '';
        }

        try {
            const formData = new FormData();
            formData.append('file', imageFile);
            console.log(formData);


            const response = await imageApi.upload(imageFile);
            console.log(response);

            return response.url; // Giả sử API trả về { data: { url: '...' } }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Upload ảnh thất bại');
        }
    };

    const handleSubmit = async () => {
        // Validate form
        if (!formData.title.trim()) {
            toast.error('Vui lòng nhập tiêu đề banner');
            return;
        }

        if (!imageFile && !formData.imageUrl) {
            toast.error('Vui lòng chọn hình ảnh banner');
            return;
        }

        if (!formData.position) {
            toast.error('Vui lòng chọn vị trí hiển thị');
            return;
        }

        setLoading(true);

        try {
            let imageUrl = formData.imageUrl;

            // Nếu có file mới thì upload
            if (imageFile) {
                imageUrl = await uploadImageToServer();
            }

            const bannerData = {
                ...formData,
                imageUrl,
                sortOrder: parseInt(formData.sortOrder) || 0,
                startDate: formData.startDate || null,
                endDate: formData.endDate || null
            };

            let response;
            if (editingBanner) {
                // Cập nhật banner
                let diff = getDiff(editingBanner, bannerData);
                response = await bannerApi.update(editingBanner.id, diff);
                setBanners(banners.map(b =>
                    b.id === editingBanner.id ? { ...editingBanner, ...bannerData } : b
                ));
                toast.success('Cập nhật banner thành công');
            } else {
                // Tạo banner mới
                response = await bannerApi.create(bannerData);
                const newBanner = response.data || bannerData;
                setBanners([newBanner, ...banners]);
                toast.success('Thêm banner mới thành công');
            }

            setShowModal(false);
        } catch (error) {
            console.error('Error saving banner:', error);
            toast.error(error.message || 'Đã có lỗi xảy ra khi lưu banner');
        } finally {
            setLoading(false);
        }
    };

    const fetchBanners = async () => {
        try {
            const response = await bannerApi.getAll(searchParams);
            setBanners(response.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
            toast.error('Đã có lỗi xảy ra khi tải danh sách banner');
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const filteredBanners = banners.filter(b => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (b.title && b.title.toLowerCase().includes(searchLower)) ||
            (b.position && b.position.toLowerCase().includes(searchLower)) ||
            (b.link && b.link.toLowerCase().includes(searchLower))
        );
    });

    // Lấy tên hiển thị cho position
    const getPositionName = (positionCode) => {
        const option = positionOptions.find(opt => opt.position === positionCode);
        return option ? `${option.title} (${option.position})` : positionCode;
    };


    console.log(banners);


    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản Lý Banner</h1>
                </div>

                {/* Actions Bar */}
                <div className="bg-white mb-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    {/* Search */}
                    <div className="relative w-full sm:w-2/3 h-10">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tiêu đề, vị trí hoặc link..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="
                                    w-full h-full
                                    pl-10 pr-4
                                    bg-gray-100
                                    border border-gray-300 rounded-sm
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2 focus:ring-blue-500"/>
                    </div>

                    {/* Add button */}
                    <button
                        onClick={handleAddNew}
                        className="h-10 flex items-center gap-2 rounded-sm bg-blue-600 text-white px-6 text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center">
                        <Plus className="w-4 h-4" />
                        Thêm Banner Mới
                    </button>
                </div>


                {/* Banners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBanners.map(banner => (
                        <div key={banner.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative aspect-video bg-gray-200">
                                <img
                                    src={banner.imageUrl.replace('http://minio:9000', 'http://localhost:9000')}
                                    alt={banner.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                                    }}
                                />
                                <div className="absolute top-2 right-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${banner.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {banner.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">{banner.title}</h3>
                                <div className="space-y-1 text-sm text-gray-600 mb-4">
                                    <p><span className="font-medium">Vị trí:</span> {getPositionName(banner.position)}</p>
                                    <p><span className="font-medium">Thứ tự:</span> {banner.sortOrder}</p>
                                    <p><span className="font-medium">Link:</span> {banner.link || 'Không có'}</p>
                                    <p><span className="font-medium">Ngày bắt đầu:</span> {banner.startDate ? formatDate(banner.startDate) : 'Không giới hạn'}</p>
                                    <p><span className="font-medium">Ngày kết thúc:</span> {banner.endDate ? formatDate(banner.endDate) : 'Không giới hạn'}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(banner.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                    >
                                        {banner.isActive ? (
                                            <><EyeOff className="w-4 h-4" /> Ẩn</>
                                        ) : (
                                            <><Eye className="w-4 h-4" /> Hiện</>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(banner)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                    >
                                        <Edit2 className="w-4 h-4" /> Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                                    >
                                        <Trash2 className="w-4 h-4" /> Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBanners.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg">
                        <p className="text-gray-500">Không tìm thấy banner nào</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                {editingBanner ? 'Chỉnh Sửa Banner' : 'Thêm Banner Mới'}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nhập tiêu đề banner"
                                    />
                                </div>

                                {/* Upload Image Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hình ảnh banner <span className="text-red-500">*</span>
                                    </label>

                                    {/* Upload Area */}
                                    {!imagePreview ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="banner-upload"
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="banner-upload"
                                                className={`cursor-pointer flex flex-col items-center justify-center ${uploading ? 'opacity-50' : ''}`}
                                            >
                                                {uploading ? (
                                                    <p>Đang upload...</p>
                                                ) : (
                                                    <>
                                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                        <p className="text-sm text-gray-600 mb-1">
                                                            <span className="text-blue-600 font-medium">Click để upload</span> hoặc kéo thả file vào đây
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG, GIF (Tối đa 5MB)
                                                        </p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    ) : (
                                        /* Image Preview */
                                        <div className="relative">
                                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={imagePreview.replace('http://minio:9000', 'http://localhost:9000')}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                                disabled={uploading}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    {uploadError && (
                                        <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Link đích
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="/khuyen-mai"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Để trống nếu không có link</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Vị trí hiển thị <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.position}
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {positionOptions.map(option => (
                                                <option key={option.position} value={option.position}>
                                                    {option.title} - {option.position}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Thứ tự
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.sortOrder}
                                            onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Số nhỏ hiển thị trước</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ngày bắt đầu
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ngày kết thúc
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                        Kích hoạt banner
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        disabled={loading || uploading}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || uploading}
                                        className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Đang xử lý...
                                            </>
                                        ) : editingBanner ? (
                                            'Cập Nhật'
                                        ) : (
                                            'Thêm Mới'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BannerManagementPage;