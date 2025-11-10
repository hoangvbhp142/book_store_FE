import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    FileText,
    Calendar,
    User,
    Edit,
    Download,
    Printer,
    Share2,
    Tag,
    Clock,
    Eye,
    CheckCircle,
    XCircle,
    AlertTriangle
} from "lucide-react";

const PolicyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("content");

    // Mock data - thay thế bằng API call thực tế
    useEffect(() => {
        setTimeout(() => {
            setPolicy({
                id: 1,
                name: "Chính sách bảo mật thông tin",
                description: "Quy định về việc bảo vệ thông tin cá nhân của người dùng và dữ liệu hệ thống",
                content: `
          <h1>Chính sách bảo mật thông tin</h1>
          <h2>1. Mục đích và phạm vi áp dụng</h2>
          <p>Chính sách này nhằm bảo vệ thông tin cá nhân của người dùng và dữ liệu hệ thống BookHaven.</p>
          
          <h2>2. Thông tin thu thập</h2>
          <ul>
            <li>Thông tin cá nhân: Họ tên, email, số điện thoại</li>
            <li>Thông tin thanh toán: Số thẻ, lịch sử giao dịch</li>
            <li>Thông tin sử dụng: Lịch sử tìm kiếm, sở thích đọc sách</li>
          </ul>

          <h2>3. Bảo mật thông tin</h2>
          <p>Chúng tôi cam kết bảo vệ thông tin của bạn bằng các biện pháp:</p>
          <ul>
            <li>Mã hóa dữ liệu nhạy cảm</li>
            <li>Giới hạn quyền truy cập</li>
            <li>Kiểm tra bảo mật định kỳ</li>
          </ul>

          <h2>4. Chia sẻ thông tin</h2>
          <p>Chúng tôi không bán, cho thuê hoặc trao đổi thông tin cá nhân của bạn.</p>
        `,
                lastUpdated: "2024-01-15T10:30:00",
                created: "2024-01-10T08:15:00",
                author: "Nguyễn Văn A",
                status: "active",
                category: "Bảo mật",
                version: "1.2",
                views: 1542,
                tags: ["bảo mật", "dữ liệu", "người dùng"]
            });
            setLoading(false);
        }, 800);
    }, [id]);

    const getStatusConfig = (status) => {
        switch (status) {
            case "active":
                return {
                    icon: <CheckCircle className="w-4 h-4" />,
                    text: "Đang hoạt động",
                    color: "bg-green-100 text-green-800 border-green-200"
                };
            case "inactive":
                return {
                    icon: <XCircle className="w-4 h-4" />,
                    text: "Ngừng hoạt động",
                    color: "bg-red-100 text-red-800 border-red-200"
                };
            case "draft":
                return {
                    icon: <AlertTriangle className="w-4 h-4" />,
                    text: "Bản nháp",
                    color: "bg-yellow-100 text-yellow-800 border-yellow-200"
                };
            default:
                return {
                    icon: <AlertTriangle className="w-4 h-4" />,
                    text: status,
                    color: "bg-gray-100 text-gray-800 border-gray-200"
                };
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // Logic download PDF
        console.log("Download policy");
    };

    const handleShare = () => {
        // Logic share policy
        console.log("Share policy");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!policy) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy chính sách</h3>
                        <p className="text-gray-500 mb-6">Chính sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                        <button
                            onClick={() => navigate("/admin/policies")}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(policy.status);

    console.log();
    

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className=" flex items-center justify-between mb-5">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-gray-900">{policy.name}</h1>
                        <p className="text-gray-600 mt-2 max-w-3xl">{policy.description}</p>
                    </div>
                    <button
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        onClick={() => navigate(`/admin/policy/:id/edit/`)}>
                        Sửa chính sách
                    </button>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <button
                                    onClick={() => setActiveTab("content")}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === "content"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Nội dung chính sách
                                </button>
                                <button
                                    onClick={() => setActiveTab("history")}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === "history"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Lịch sử thay đổi
                                </button>
                                <button
                                    onClick={() => setActiveTab("related")}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === "related"
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Thông tin
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === "content" && (
                                <div className="prose prose-lg max-w-none">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: policy.content }}
                                        className="policy-content"
                                    />
                                </div>
                            )}

                            {activeTab === "history" && (
                                <div className="text-center py-8">
                                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Lịch sử thay đổi</h3>
                                    <p className="text-gray-500">Tính năng đang được phát triển</p>
                                </div>
                            )}

                            {activeTab === "related" && (
                                <div className="text-center py-8">
                                    <div className="space-y-4">
                                        {/* Trạng thái */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-1 ${statusConfig.color}`}>
                                                {statusConfig.icon}
                                                <span className="ml-1.5">{statusConfig.text}</span>
                                            </div>
                                        </div>

                                        {/* Phiên bản */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Phiên bản</label>
                                            <p className="text-gray-900 font-medium">v{policy.version}</p>
                                        </div>

                                        {/* Danh mục */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Danh mục</label>
                                            <p className="text-gray-900 font-medium">{policy.category}</p>
                                        </div>

                                        {/* Tác giả */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Tác giả</label>
                                            <div className="flex items-center mt-1">
                                                <User className="w-4 h-4 text-gray-400 mr-2" />
                                                <span className="text-gray-900">{policy.author}</span>
                                            </div>
                                        </div>

                                        {/* Ngày tạo */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                                            <div className="flex items-center mt-1">
                                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                                <span className="text-gray-900">
                                                    {new Date(policy.created).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Cập nhật lần cuối */}
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Cập nhật</label>
                                            <div className="flex items-center mt-1">
                                                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                                <span className="text-gray-900">
                                                    {new Date(policy.lastUpdated).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicyDetail;