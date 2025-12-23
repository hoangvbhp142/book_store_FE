import {
    Image as ImageIcon,
    Plus,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAll as getAllCategories } from '../stores/categorySlice';
import { create as createPublisher, getAll as getAllPublishers } from '../stores/publisherSlice';
import { create as createAuthor, getAll as getAllAuthors } from '../stores/authorSlice';
import Select from 'react-select';
import { toast } from 'react-toastify';
import imageApi from '../api/imageApi';
import { createBook, fetchBookById, updateBook } from '../stores/bookSlice';
import { useParams } from 'react-router-dom';
import { getDiff } from '../app/utils';
import AuthorModal from '../modal/AuthorModal';
import Modal from '../modal/Modal';
import PublisherModal from '../modal/PublisherModal';

// Constants
const INITIAL_FORM_DATA = {
    title: '',
    description: '',
    isbn: '',
    language: '',
    page: 0,
    weight: 0,
    publishedAt: '',
    sku: '',
    status: 'DRAFT',
    stockQty: 0,
    sellerPrice: '',
    rentPricePerDay: '',
    rentPenaltyPerDay: '',
    rentPricePerWeek: '',
    rentPenaltyPerWeek: '',
    rentPricePerMonth: '',
    rentPenaltyPerMonth: '',
    photoUrl: '',
    thumbnailUrl: '',
    mediaUrls: [],
    categoryIds: [],
    authorIds: [],
    publisherId: '',
    rentDeposit: ''
};

const CUSTOM_STYLES = {
    control: (base, state) => ({
        ...base,
        border: '1px solid #D1D5DB',
        borderRadius: '0.5rem',
        padding: '0.25rem',
        boxShadow: 'none',
        '&:hover': {
            borderColor: '#3B82F6'
        },
        borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#3B82F6',
        borderRadius: '0.375rem',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: 'white',
        fontWeight: '500',
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: 'white',
        borderRadius: '0 0.375rem 0.375rem 0',
        '&:hover': {
            backgroundColor: '#EF4444',
            color: 'white',
        },
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
        color: state.isSelected ? 'white' : '#1F2937',
        '&:hover': {
            backgroundColor: state.isSelected ? '#3B82F6' : '#EFF6FF',
        }
    })
};

const ModifyBookForm = () => {
    // ========== HOOKS & PARAMS ==========
    const { id } = useParams();
    const isEdit = Boolean(id);
    const dispatch = useDispatch();

    // ========== REDUX SELECTORS ==========
    const { authors } = useSelector(state => state.author);
    const { categories } = useSelector(state => state.category);
    const { publishers } = useSelector(state => state.publisher);
    const { selectedBook, loading: bookLoading, error } = useSelector(state => state.books);

    // ========== STATE MANAGEMENT ==========
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [mediaImages, setMediaImages] = useState([]);
    const [existingMediaUrls, setExistingMediaUrls] = useState([]);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showAuthorModal, setShowAuthorModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showPublisherModal, setShowPublisherModal] = useState(false);

    // ========== DERIVED VALUES ==========

    //Author
    const ADD_NEW_AUTHOR_OPTION = {
        value: 'add_new_author',
        label: (<span className="text-blue-600 font-medium flex items-center gap-1"><Plus className='w-4 h-4' /> Thêm tác giả mới</span>),
    }

    const authorOptions = authors?.map(author => ({
        value: author.id,
        label: author.name
    })) || [];

    const authorOptionsWithAddNew = [
        ADD_NEW_AUTHOR_OPTION,
        ...authorOptions
    ];

    //Category
    const ADD_NEW_CATEGORY_OPTION = {
        value: 'add_new_category',
        label: (<span className="text-blue-600 font-medium flex items-center gap-1"><Plus className='w-4 h-4' /> Thêm danh mục mới</span>),
    }
    const categoryOptions = categories?.map(category => ({
        value: category.id,
        label: category.name
    })) || [];

    const categoryOptionsWithAddNew = [
        ADD_NEW_CATEGORY_OPTION,
        ...categoryOptions
    ];

    const selectedAuthors = authorOptions.filter(option =>
        (formData.authorIds || []).includes(option.value)
    );

    const selectedCategories = categoryOptions.filter(option =>
        (formData.categoryIds || []).includes(option.value)
    );

    const imagePreview = image ? URL.createObjectURL(image) : existingImage;

    // ========== EVENT HANDLERS ==========
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;


        if (value === 'add_new_publisher') {
            console.log(name, value);
            setShowPublisherModal(true);
            return;
        }

        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAuthorChange = (selectedOptions) => {

        if (!selectedOptions) {
            return;
        }

        const isAddNew = selectedOptions.some(option => option.value === 'add_new_author');

        if (isAddNew) {
            const filtered = selectedOptions.filter(option => option.value !== 'add_new_author');
            setShowAuthorModal(true);
            return;
        }

        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData(prevData => ({
            ...prevData,
            authorIds: selectedValues
        }));
    };

    const handleCategoryChange = (selectedOptions) => {

        if (!selectedOptions) {
            return;
        }

        const isAddNew = selectedOptions.some(option => option.value === 'add_new_category');

        if (isAddNew) {
            const filtered = selectedOptions.filter(option => option.value !== 'add_new_category');
            setShowCategoryModal(true);
            return;
        }

        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData(prevData => ({
            ...prevData,
            categoryIds: selectedValues
        }));
    };

    const handleMediaImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setMediaImages(prev => [...prev, ...files]);
    };

    const removeMediaImage = (index) => {
        setMediaImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingMedia = (index) => {
        setExistingMediaUrls(prev => prev.filter((_, i) => i !== index));
    };

    // ========== API FUNCTIONS ==========
    const fetchData = async () => {
        setLoading(true);
        try {
            const parameters = {
                filter: {},
                limit: 1000
            }

            await Promise.all([
                dispatch(getAllCategories({ params: parameters, isAdmin: true })).unwrap(),
                dispatch(getAllPublishers({ filter: {}, limit: 10000 })).unwrap(),
                dispatch(getAllAuthors({ filter: {}, limit: 10000 })).unwrap()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const addNewAuthor = async (authorData) => {
        try {
            const response = await dispatch(createAuthor(authorData)).unwrap();
            console.log(response);
            const newAuthorOption = {
                value: response.id,
                label: response.name
            };
            setShowAuthorModal(false);
            setFormData(prevData => ({
                ...prevData,
                authorIds: [...(prevData.authorIds || []), response.id]
            }));
        } catch (error) {
            console.log(error);
        }
    }

    const addNewPublisher = async (publisherData) => {
        try {
            const response = await dispatch(createPublisher(publisherData)).unwrap();
            console.log(response);
            const newPublisherOption = {
                value: response.id,
                label: response.name
            };
            setShowPublisherModal(false);
            setFormData(prevData => ({
                ...prevData,
                publisherId: response.id
            }));
        } catch (error) {
            console.log(error);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Chuyển đổi các trường số từ string sang number
        const submitData = {
            ...formData,
            page: parseInt(formData.page) || 0,
            weight: parseInt(formData.weight) || 0,
            stockQty: parseInt(formData.stockQty) || 0,
            sellerPrice: parseFloat(formData.sellerPrice) || 0,
            rentPricePerDay: parseFloat(formData.rentPricePerDay) || 0,
            rentPenaltyPerDay: parseFloat(formData.rentPenaltyPerDay) || 0,
            rentPricePerWeek: parseFloat(formData.rentPricePerWeek) || 0,
            rentPenaltyPerWeek: parseFloat(formData.rentPenaltyPerWeek) || 0,
            rentPricePerMonth: parseFloat(formData.rentPricePerMonth) || 0,
            rentPenaltyPerMonth: parseFloat(formData.rentPenaltyPerMonth) || 0,
            rentDeposit: parseFloat(formData.rentDeposit) || 0,
        };

        try {
            let finalPayload = { ...submitData };

            // Upload ảnh bìa chính
            if (image) {
                const imageUrl = await imageApi.upload(image);
                let photoUrl = imageUrl.url;
                photoUrl = photoUrl.replace('http://minio:9000', 'http://localhost:9000');
                finalPayload.photoUrl = photoUrl;
                finalPayload.thumbnailUrl = photoUrl;
            }

            // Upload các ảnh minh họa
            const mediaUrls = [...existingMediaUrls];
            if (mediaImages.length > 0) {
                for (const mediaImage of mediaImages) {
                    const imageUrl = await imageApi.upload(mediaImage);
                    let mediaUrl = imageUrl.url;
                    mediaUrl = mediaUrl.replace('http://minio:9000', 'http://localhost:9000');
                    mediaUrls.push(mediaUrl);
                }
            }
            finalPayload.mediaUrls = mediaUrls;

            console.log("RAW submit:", finalPayload);

            if (isEdit) {
                const diffPayload = getDiff(originalData, finalPayload);
                console.log("DIFF payload:", diffPayload);

                const result = await dispatch(updateBook({ id: id, data: diffPayload })).unwrap();
                console.log(result);

                toast.success("Cập nhật thành công");
            }
            else {
                const result = await dispatch(createBook(finalPayload)).unwrap();
                toast.success("Thêm sách thành công");

                // RESET FORM SAU KHI THÊM MỚI THÀNH CÔNG
                setFormData(INITIAL_FORM_DATA);
                setImage(null);
                setExistingImage('');
                setMediaImages([]);
                setExistingMediaUrls([]);
            }
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    };

    // ========== EFFECTS ==========
    // Effect for initial data loading
    useEffect(() => {
        if (id) {
            dispatch(fetchBookById({ id, isAdmin: true }));
        }
        fetchData();
    }, [id, dispatch]);

    // Effect for updating form data when selectedBook changes
    useEffect(() => {
        if (selectedBook && id) {
            const { id, bookAuthors, bookCategories, mediaPaths, thumbnailPath, photoPath, publisher, ...rest } = selectedBook;

            const processed = {
                ...rest,
                authorIds: bookAuthors.map(author => author.authorId),
                categoryIds: bookCategories.map(category => category.categoryId)
            };

            console.log(processed);

            setFormData(processed);
            setOriginalData(processed);

            if (selectedBook.photoUrl) {
                let url = selectedBook.photoUrl;
                url = url.replace('http://minio:9000', 'http://localhost:9000');
                setExistingImage(url);
            }

            if (selectedBook.mediaUrls && selectedBook.mediaUrls.length > 0) {
                const processedMediaUrls = selectedBook.mediaUrls.map(url =>
                    url.replace('http://minio:9000', 'http://localhost:9000')
                );
                setExistingMediaUrls(processedMediaUrls);
            }
        }
    }, [selectedBook, id]);

    // Effect for cleaning up object URLs
    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(URL.createObjectURL(image));
            }
            mediaImages.forEach(image => {
                URL.revokeObjectURL(URL.createObjectURL(image));
            });
        };
    }, [image, mediaImages]);

    // ========== RENDER LOGIC ==========
    if (loading || bookLoading) {
        return (
            <div className="bg-white shadow-sm rounded-2xl p-8 border border-gray-100">
                <div className="flex justify-center items-center h-64">
                    <div className="text-lg">Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm rounded-2xl p-8 border border-gray-100">
            <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Thông tin cơ bản */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Thông tin cơ bản</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ảnh bìa <span className="text-red-500">*</span>
                            </label>
                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-gray-50">
                                {!imagePreview ? (
                                    <>
                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-900">Tải ảnh bìa</p>
                                            <p className="text-xs text-gray-500">PNG, JPG tối đa 10MB</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-center">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-48 object-contain"
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    id="image"
                                    required={!isEdit}
                                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
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
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="font-medium text-gray-700 mb-2">
                                        SKU <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name='sku'
                                        value={formData.sku}
                                        onChange={handleChange}
                                        placeholder="Mã sản phẩm"
                                        className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="font-medium text-gray-700 mb-2">
                                        Trạng thái <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name='status'
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    >
                                        <option value="DRAFT">Bản nháp</option>
                                        <option value="PUBLISHED">Đã xuất bản</option>
                                        <option value="ARCHIVED">Đã lưu trữ</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ảnh minh họa sách */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Ảnh minh họa sách</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {/* Hiển thị ảnh hiện có (trong chế độ edit) */}
                            {existingMediaUrls.map((url, index) => (
                                <div key={`existing-${index}`} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Media ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingMedia(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {/* Hiển thị ảnh mới được chọn */}
                            {mediaImages.map((image, index) => (
                                <div key={`new-${index}`} className="relative group">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`New media ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeMediaImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {/* Nút thêm ảnh mới */}
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm font-medium text-gray-600">Thêm ảnh</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleMediaImagesChange}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-gray-500">Có thể chọn nhiều ảnh cùng lúc. Ảnh sẽ được hiển thị theo thứ tự upload.</p>
                    </div>
                </div>

                {/* Thông tin liên quan */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Thông tin liên quan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Tác giả - Multiple Select với Tag */}
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Tác giả <span className="text-red-500">*</span>
                            </label>
                            <Select
                                isMulti
                                options={authorOptionsWithAddNew}
                                value={selectedAuthors}
                                onChange={handleAuthorChange}
                                placeholder="Chọn tác giả..."
                                styles={CUSTOM_STYLES}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                noOptionsMessage={() => "Không tìm thấy tác giả"}
                                isSearchable
                            />
                        </div>

                        {/* Nhà xuất bản - Single Select */}
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Nhà xuất bản <span className="text-red-500">*</span>
                            </label>
                            <select
                                name='publisherId'
                                value={formData.publisherId}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required
                            >
                                <option value="">Chọn nhà xuất bản</option>
                                <option value="add_new_publisher">
                                    <span className='flex items-center'>
                                        <Plus className='w-4 h-4 inline-block mr-1' /> Thêm nhà xuất bản mới
                                    </span>
                                </option>
                                {publishers.map(publisher => (
                                    <option key={publisher.id} value={publisher.id}>
                                        {publisher.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Danh mục - Multiple Select với Tag */}
                        <div className="flex flex-col">
                            <label className="font-medium text-gray-700 mb-2">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <Select
                                isMulti
                                options={categoryOptionsWithAddNew}
                                value={selectedCategories}
                                onChange={handleCategoryChange}
                                placeholder="Chọn danh mục..."
                                styles={CUSTOM_STYLES}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                noOptionsMessage={() => "Không tìm thấy danh mục"}
                                isSearchable
                            />
                        </div>
                    </div>
                </div>

                {/* Giá cả & Số lượng */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Giá cả & Số lượng</h2>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700 mb-2">
                                    Giá bán (VND) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name='sellerPrice'
                                    value={formData.sellerPrice}
                                    onChange={handleChange}
                                    placeholder="Nhập giá bán"
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700 mb-2">
                                    Số lượng tồn kho <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name='stockQty'
                                    value={formData.stockQty}
                                    onChange={handleChange}
                                    placeholder="Nhập số lượng"
                                    min="0"
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Tiền cọc */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700 mb-2">
                                    Tiền cọc (VND) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name='rentDeposit'
                                    value={formData.rentDeposit}
                                    onChange={handleChange}
                                    placeholder="Nhập tiền cọc"
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div></div> {/* Để trống để căn đều */}
                        </div>

                        {/* Giá thuê theo ngày */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700 mb-2">
                                    Giá thuê/ngày (VND)
                                </label>
                                <input
                                    type="text"
                                    name='rentPricePerDay'
                                    value={formData.rentPricePerDay}
                                    onChange={handleChange}
                                    placeholder="Nhập giá thuê theo ngày"
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700 mb-2">
                                    Phí phạt/ngày (VND)
                                </label>
                                <input
                                    type="text"
                                    name='rentPenaltyPerDay'
                                    value={formData.rentPenaltyPerDay}
                                    onChange={handleChange}
                                    placeholder="Nhập phí phạt theo ngày"
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Giá thuê theo tuần */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700 mb-2">
                                    Giá thuê/tuần (VND)
                                </label>
                                <input
                                    type="text"
                                    name='rentPricePerWeek'
                                    value={formData.rentPricePerWeek}
                                    onChange={handleChange}
                                    placeholder="Nhập giá thuê theo tuần"
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700 mb-2">
                                    Phí phạt/tuần (VND)
                                </label>
                                <input
                                    type="text"
                                    name='rentPenaltyPerWeek'
                                    value={formData.rentPenaltyPerWeek}
                                    onChange={handleChange}
                                    placeholder="Nhập phí phạt theo tuần"
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Giá thuê theo tháng */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700 mb-2">
                                    Giá thuê/tháng (VND) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name='rentPricePerMonth'
                                    value={formData.rentPricePerMonth}
                                    onChange={handleChange}
                                    placeholder="Nhập giá thuê theo tháng"
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700 mb-2">
                                    Phí phạt/tháng (VND)
                                </label>
                                <input
                                    type="text"
                                    name='rentPenaltyPerMonth'
                                    value={formData.rentPenaltyPerMonth}
                                    onChange={handleChange}
                                    placeholder="Nhập phí phạt theo tháng"
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thông tin chi tiết */}
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
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700 mb-2">
                                    Số trang <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name='page'
                                    value={formData.page}
                                    onChange={handleChange}
                                    placeholder="Nhập số trang"
                                    min="1"
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    required
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
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700 mb-2">
                                    Ngày xuất bản <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name='publishedAt'
                                    value={formData.publishedAt}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium text-gray-700 mb-2">
                                    URL Ảnh chính
                                </label>
                                <input
                                    type="text"
                                    name='photoUrl'
                                    value={formData.photoUrl}
                                    onChange={handleChange}
                                    placeholder="Nhập URL ảnh"
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                />
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
                        {isEdit ? 'Cập nhật Sách' : 'Thêm Sách'}
                    </button>
                </div>
            </form>

            <Modal isOpen={showAuthorModal} onClose={() => setShowAuthorModal(false)} title={"Thêm Tác giả mới"}>
                <AuthorModal
                    // isEdit={modalData.isEdit}
                    // data={modalData.author}
                    onClose={() => setShowAuthorModal(false)}
                    onSubmit={addNewAuthor}
                />
            </Modal>

            {/* <Modal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} title={"Thêm Tác giả mới"}>
                <AuthorModal
                    // isEdit={modalData.isEdit}
                    // data={modalData.author}
                    onClose={() => setShowCategoryModal(false)}
                    onSubmit={addNewCategory}
                />
            </Modal> */}

            <Modal isOpen={showPublisherModal} onClose={() => setShowPublisherModal(false)} title={"Thêm Nhà xuất bản mới"}>
                <PublisherModal
                    // isEdit={modalData.isEdit}
                    // data={modalData.author}
                    onClose={() => setShowPublisherModal(false)}
                    onSubmit={addNewPublisher}
                />
            </Modal>
        </div>
    );
}

export default ModifyBookForm;