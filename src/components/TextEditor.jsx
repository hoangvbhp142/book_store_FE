import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    createPolicy,
    updatePolicy,
    getPolicyById,
    clearCurrentPolicy
} from "../stores/policySlice";
import { toast } from "react-toastify";

const TextEditor = () => {
    const dispatch = useDispatch();
    const { currentPolicy, loading, error, success } = useSelector(state => state.policy);

    const [content, setContent] = useState("");
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "",
        content: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    // Tự động tạo slug từ title
    useEffect(() => {
        if (formData.title) {
            const slug = formData.title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w\s]/g, "")
                .replace(/\s+/g, "-");
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title]);

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ font: [] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold", "italic", "underline", "strike",
        "font",
        "color",
        "background",
        "align",
        "list", "bullet",
        "link", "image",
    ];

    const handleSave = async () => {
        // Validation
        if (!formData.title.trim() || !formData.slug.trim() || !formData.category || !content.trim()) {
            return;
        }

        const policyData = {
            title: formData.title,
            slug: formData.slug,
            category: formData.category,
            content: content
        };

        try {
            if (isEdit) {
                await dispatch(updatePolicy({ id, payload: policyData })).unwrap();
                toast.success("Cập nhật chính sách thành công");
            } else {
                await dispatch(createPolicy(policyData)).unwrap();
                toast.success("Thêm chính sách mới thành công");
            }
        } catch (error) {
            toast.error(error);
        }
    };

    // Fetch policy by id khi edit
    useEffect(() => {
        if (isEdit && id) {
            dispatch(getPolicyById(id));
        }
    }, [isEdit, id, dispatch]);

    // Set form data khi currentPolicy thay đổi (khi edit)
    useEffect(() => {
        if (currentPolicy && isEdit) {
            setFormData({
                title: currentPolicy.title || "",
                slug: currentPolicy.slug || "",
                category: currentPolicy.category || "",
                content: currentPolicy.content || "",
            });
            setContent(currentPolicy.content || "");
        }
    }, [currentPolicy, isEdit]);

    // Clear current policy khi unmount
    useEffect(() => {
        return () => {
            dispatch(clearCurrentPolicy());
        };
    }, [dispatch]);

    console.log(formData);


    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-100 p-3 sm:p-4 lg:px-6">
            <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full min-h-0">

                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    {isEdit ? "Sửa chính sách" : "Thêm chính sách mới"}
                </h1>

                {/* Editor Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden flex-1 flex flex-col min-h-0">

                    <div className="p-3 sm:p-4 flex-1 flex flex-col min-h-0 overflow-hidden">

                        {/* Tiêu đề */}
                        <div className="mb-4 flex-shrink-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập tiêu đề chính sách..."
                                onChange={handleChange}
                            />
                        </div>

                        {/* Slug */}
                        <div className="mb-4 flex-shrink-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="slug-tu-dong-tao-tu-tieu-de..."
                                onChange={handleChange}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Slug sẽ tự động được tạo từ tiêu đề. Bạn có thể chỉnh sửa nếu cần.
                            </p>
                        </div>

                        {/* Danh mục */}
                        <div className="mb-4 flex-shrink-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={handleChange}
                            >
                                <option value="">Chọn danh mục</option>
                                <option value="shipping">Vận chuyển</option>
                                <option value="payment">Thanh toán</option>
                                <option value="return">Đổi trả</option>
                                <option value="privacy">Bảo mật</option>
                                <option value="terms">Điều khoản</option>
                                <option value="warranty">Bảo hành</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>

                        {/* Editor */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung chính sách <span className="text-red-500">*</span>
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                className="flex-1 min-h-0"
                                modules={modules}
                                formats={formats}
                            />
                        </div>
                    </div>

                    <div className="bg-gray-100 px-4 sm:px-6 py-3 border-t border-gray-200 flex-shrink-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <span className="text-sm text-gray-600 font-medium">
                                {content.length > 0 ? `${content.replace(/<[^>]*>/g, '').length} ký tự` : "Chưa có nội dung"}
                            </span>

                            <button
                                onClick={handleSave}
                                disabled={loading || !content.trim() || !formData.title.trim() || !formData.slug.trim() || !formData.category}
                                className={`
                                    flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-md font-medium transition-all duration-200 w-full sm:w-auto
                                    ${loading || !content.trim() || !formData.title.trim() || !formData.slug.trim() || !formData.category
                                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                        : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                                    }
                                `}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        {isEdit ? "Cập nhật" : "Thêm mới"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Có thể thêm thông báo lỗi hoặc thành công tại đây nếu dùng state local, nhưng giờ chúng ta dùng toast nên có thể bỏ */}
            </div>
        </div>
    );
};

export default TextEditor;