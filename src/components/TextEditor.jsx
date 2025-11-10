import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";

import policiesData from "../data/Policies";

const TextEditor = () => {
    const [value, setValue] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        id: null,
        name: "",
        description: "",
        content: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

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
        setIsLoading(true);
        setStatus("");

        try {
            const res = await fetch("http://localhost/bookhaven-api/save_policy.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: value }),
            });

            const data = await res.json();
            if (data.success) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error(err);
            setStatus("connection-error");
        } finally {
            setIsLoading(false);
        }
    };

    const statusMessages = {
        success: "✅ Đã lưu nội dung vào cơ sở dữ liệu!",
        error: "❌ Lỗi khi lưu nội dung!",
        "connection-error": "⚠️ Không thể kết nối đến server!",
    };

    const statusColors = {
        success: "text-green-600 bg-green-50 border-green-200",
        error: "text-red-600 bg-red-50 border-red-200",
        "connection-error": "text-yellow-700 bg-yellow-50 border-yellow-200",
    };


    useEffect(() => {
        if (isEdit) {
            const existingPolicy = policiesData.find(
                (policy) => policy.id.toString() === id
            );
            if (existingPolicy) {
                setFormData(existingPolicy);
                setValue(existingPolicy.content);
            }
        }
    }, [isEdit, id]);

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-100 p-3 sm:p-4 lg:p-6">
            <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full min-h-0">

                <h1 className="text-2xl font-bold text-gray-900 mb-3">{isEdit ? "Sửa chính sách" : "Thêm chính sách mới"}</h1>

                {/* Editor Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden flex-1 flex flex-col min-h-0">

                    <div className="p-3 sm:p-4 flex-1 flex flex-col min-h-0 overflow-hidden">
                        {/* Tên văn bản */}
                        <div className="mb-4 flex-shrink-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập tên văn bản..."
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4 flex-shrink-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập mô tả..."
                                onChange={handleChange}

                            />
                        </div>

                        {/* Editor */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung chính
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={value}
                                onChange={setValue}
                                className="flex-1 min-h-0"
                                modules={modules}
                                formats={formats}
                            />
                        </div>
                    </div>

                    <div className="bg-gray-100 px-4 sm:px-6 py-3 border-t border-gray-200 flex-shrink-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <span className="text-sm text-gray-600 font-medium">
                                {value.length > 0 ? `${value.replace(/<[^>]*>/g, '').length} ký tự` : "Chưa có nội dung"}
                            </span>

                            <button
                                onClick={handleSave}
                                disabled={isLoading || !value.trim()}
                                className={`
                            flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-md font-medium transition-all duration-200 w-full sm:w-auto
                            ${isLoading || !value.trim()
                                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                        : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                                    }
                        `}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Lưu nội dung
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                {status && (
                    <div className={`mt-4 p-3 sm:p-4 rounded-md border ${statusColors[status]} transition-all duration-300 flex-shrink-0`}>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {status === "success" && "✅"}
                                {status === "error" && "❌"}
                                {status === "connection-error" && "⚠️"}
                            </div>
                            <div className="ml-3">
                                <p className="font-medium text-sm">{statusMessages[status]}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextEditor;