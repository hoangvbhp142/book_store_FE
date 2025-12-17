import { useState } from "react";
import { ArrowLeft, Calendar, Clock, AlertCircle, RotateCcw, UndoIcon, CheckCircle, BookOpen, X, MapPin, Package, Camera } from "lucide-react";
import sach1 from '../assets/sach1.jpg';
import { toast } from "react-toastify";
import ReturnOrder from "../components/ReturnOrder";

// Mock data - đã thêm trạng thái đã trả
const mockRentals = [
    {
        id: "1",
        title: "The Midnight Library",
        author: "Matt Haig",
        cover: sach1,
        rentalStartDate: "October 26, 2025",
        rentalEndDate: "November 9, 2025",
        returnDate: null,
        daysRemaining: 12,
        isOverdue: false,
        status: "active", // active, overdue, returned
        price: 4.99,
    },
    {
        id: "2",
        title: "Educated",
        author: "Tara Westover",
        cover: sach1,
        rentalStartDate: "October 20, 2025",
        rentalEndDate: "November 3, 2025",
        returnDate: null,
        daysRemaining: 4,
        isOverdue: false,
        status: "active",
        price: 4.99,
    },
    {
        id: "3",
        title: "Project Hail Mary",
        author: "Andy Weir",
        cover: sach1,
        rentalStartDate: "October 10, 2025",
        rentalEndDate: "October 24, 2025",
        returnDate: null,
        daysRemaining: -6,
        isOverdue: true,
        status: "overdue",
        price: 5.99,
    },
    {
        id: "4",
        title: "The Silent Patient",
        author: "Alex Michaelides",
        cover: sach1,
        rentalStartDate: "October 1, 2025",
        rentalEndDate: "October 15, 2025",
        returnDate: "October 14, 2025",
        daysRemaining: 0,
        isOverdue: false,
        status: "returned",
        price: 4.99,
    },
    {
        id: "5",
        title: "Atomic Habits",
        author: "James Clear",
        cover: sach1,
        rentalStartDate: "September 15, 2025",
        rentalEndDate: "September 29, 2025",
        returnDate: "September 28, 2025",
        daysRemaining: 0,
        isOverdue: false,
        status: "returned",
        price: 4.99,
    },
];


const mockReturnOrders = [
    {
        orderId: "RET_001",
        userId: "USER_001",
        requestDate: "2025-02-10",
        status: "pending", // pending | processing | completed | rejected

        noteFromUser: "Tôi muốn trả sớm tất cả sách đã đọc.",
        noteFromAdmin: "",

        processedDate: null,

        items: [
            {
                bookId: "BOOK_001",
                bookTitle: "Đắc Nhân Tâm",
                bookImage: "https://example.com/book/dnt.jpg",

                rentDate: "2025-02-01",
                dueDate: "2025-02-15",

                fee: 0,
                itemStatus: "waiting" // waiting | received | rejected
            },
            {
                bookId: "BOOK_005",
                bookTitle: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
                bookImage: "https://example.com/book/ttdgbn.jpg",

                rentDate: "2025-01-20",
                dueDate: "2025-02-20",

                fee: 0,
                itemStatus: "waiting"
            }
        ]
    },

    {
        orderId: "RET_002",
        userId: "USER_001",
        requestDate: "2025-01-28",
        status: "processing",

        noteFromUser: "Tôi đã gửi sách qua bưu điện.",
        noteFromAdmin: "Kho đã nhận 1 phần.",

        processedDate: null,

        items: [
            {
                bookId: "BOOK_004",
                bookTitle: "7 Thói Quen Hiệu Quả",

                rentDate: "2025-01-10",
                dueDate: "2025-01-20",

                fee: 30000,
                itemStatus: "received"
            },
            {
                bookId: "BOOK_006",
                bookTitle: "Hai Số Phận",

                rentDate: "2025-01-08",
                dueDate: "2025-01-25",

                fee: 0,
                itemStatus: "waiting"
            }
        ]
    },

    {
        orderId: "RET_003",
        userId: "USER_001",
        requestDate: "2025-01-05",
        status: "completed",

        noteFromUser: "",
        noteFromAdmin: "Đã kiểm tra đầy đủ",

        processedDate: "2025-01-08",

        items: [
            {
                bookId: "BOOK_002",
                bookTitle: "Tắt Đèn",
                rentDate: "2024-12-20",
                dueDate: "2025-01-10",
                fee: 0,
                itemStatus: "received"
            },
            {
                bookId: "BOOK_003",
                bookTitle: "Harry Potter 1",
                rentDate: "2024-12-20",
                dueDate: "2025-01-10",
                fee: 0,
                itemStatus: "received"
            }
        ]
    }
];

const stores = [
    { id: 1, name: 'Chi nhánh Quận 1', address: '123 Nguyễn Huệ, Q.1, TP.HCM', hours: '8:00 - 22:00' },
    { id: 2, name: 'Chi nhánh Quận 3', address: '456 Lê Văn Sỹ, Q.3, TP.HCM', hours: '8:00 - 22:00' },
    { id: 3, name: 'Chi nhánh Thủ Đức', address: '789 Võ Văn Ngân, TP.Thủ Đức', hours: '9:00 - 21:00' }
];

const RentedBooksPage = () => {
    const [activeTab, setActiveTab] = useState("all"); // all, active, overdue, returned
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returnStep, setReturnStep] = useState(1);
    const [returnData, setReturnData] = useState({
        returnMethod: '',
        returnLocation: '',
        pickupAddress: '',
        pickupPhone: '',
        pickupTime: 'morning',
        bookConditions: {},
        notes: ''
    });

    const overdueRentals = mockRentals.filter((book) => book.isOverdue);

    const handleToggleSelection = (bookId) => {
        if (selectedBooks.includes(bookId)) {
            setSelectedBooks(selectedBooks.filter(id => id !== bookId));
        } else {
            setSelectedBooks([...selectedBooks, bookId]);
        }
    };

    const handleStartReturn = () => {
        if (selectedBooks.length > 0) {
            // Initialize book conditions for all selected books
            const initialConditions = {};
            selectedBooks.forEach(id => {
                initialConditions[id] = 'good';
            });
            setReturnData({
                ...returnData,
                bookConditions: initialConditions
            });
            setShowReturnModal(true);
            setReturnStep(1);
        }
    };

    const handleCloseModal = () => {
        setShowReturnModal(false);
        setReturnStep(1);
        //setSelectedBooks([]);
    };

    const handleNextStep = () => {
        if (returnStep < 4) setReturnStep(returnStep + 1);
    };

    const handleBackStep = () => {
        if (returnStep > 1) setReturnStep(returnStep - 1);
    };

    const handleSubmitReturn = () => {
        // API call here
        setReturnStep(4);
        console.log(returnData);
        setSelectedBooks([]);
    };

    const getSelectedBooksData = () => {
        return mockRentals.filter(book => selectedBooks.includes(book.id));
    };

    const openReturnModal = () => {
        if (selectedBooks.length === 0) {
            toast.error("Vui lòng chọn sách cần trả");
            return;
        }
        setShowReturnModal(true);
    }

    const filterRentals = () => {
        switch (activeTab) {
            case "renting":
                return mockRentals.filter(book => book.status !== "returned");
            case "returnorder":
                return mockRentals.filter(book => book.status === "overdue");
            case "history":
                return mockRentals.filter(book => book.status === "returned");
            default:
                return mockRentals;
        }
    };

    const filteredRentals = filterRentals();

    const getStatusCounts = () => {
        return {
            all: mockRentals.length,
            active: mockRentals.filter(b => b.status !== "returned").length,
            overdue: mockRentals.filter(b => b.status === "overdue").length,
            returned: mockRentals.filter(b => b.status === "returned").length,
        };
    };

    const statusCounts = getStatusCounts();

    console.log(selectedBooks);


    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
            {/* Header */}
            <div className="bg-white top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Sách đã thuê</h1>
                            <p className="mt-2 text-gray-600">
                                Quản lý sách bạn đang thuê và lịch sử thuê sách
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={openReturnModal}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Trả sách
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats and Tabs */}
            <div className="max-w-7xl mx-auto">
                {/* Tabs */}
                <div className="bg-white mb-6">
                    <div className="flex flex-wrap border-b border-gray-200">
                        <button
                            className={`px-6 py-4 font-medium text-sm border-b-2 transition-all ${activeTab === "renting"
                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                            onClick={() => setActiveTab("renting")}
                        >
                            Đang thuê ({statusCounts.active})
                        </button>
                        <button
                            className={`px-6 py-4 font-medium text-sm border-b-2 transition-all ${activeTab === "returnorder"
                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                            onClick={() => setActiveTab("returnorder")}
                        >
                            Yêu cầu trả sách ({mockReturnOrders.length})
                        </button>
                        <button
                            className={`px-6 py-4 font-medium text-sm border-b-2 transition-all ${activeTab === "history"
                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                            onClick={() => setActiveTab("history")}
                        >
                            Lịch sử ({mockReturnOrders.length})
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {
                            activeTab !== 'returnorder' && (
                                filteredRentals.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredRentals.map((book) => (
                                            <RentalBookCard key={book.id} selectedBooks={selectedBooks} book={book} onToggleSelection={() => handleToggleSelection(book.id)} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                            <BookOpen className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {activeTab === "renting" && "Chưa có sách nào được thuê"}
                                            {activeTab === "active" && "Không có sách đang thuê"}
                                            {activeTab === "overdue" && "Không có sách quá hạn"}
                                            {activeTab === "returned" && "Chưa có sách đã trả"}
                                        </h3>
                                        <p className="text-gray-500 max-w-md mx-auto">
                                            {activeTab === "all" && "Bắt đầu thuê sách từ thư viện để xem chúng ở đây"}
                                            {activeTab === "active" && "Tất cả sách đã được trả hoặc chưa có sách đang thuê"}
                                            {activeTab === "overdue" && "Tuyệt vời! Không có sách nào quá hạn"}
                                            {activeTab === "returned" && "Các sách đã trả sẽ xuất hiện ở đây"}
                                        </p>
                                    </div>
                                )
                            )
                        }

                        {
                            activeTab === "returnorder" && (
                                <ReturnOrder returnOrders={mockReturnOrders} />
                            )
                        }
                    </div>
                </div>
            </div>

            {showReturnModal && (
                <ReturnModal
                    books={getSelectedBooksData()}
                    step={returnStep}
                    returnData={returnData}
                    setReturnData={setReturnData}
                    onClose={handleCloseModal}
                    onNext={handleNextStep}
                    onBack={handleBackStep}
                    onSubmit={handleSubmitReturn}
                />
            )}
        </main>
    );
};

function RentalBookCard({ selectedBooks, book, onToggleSelection }) {
    const getStatusConfig = () => {
        switch (book.status) {
            case "active":
                if (book.daysRemaining <= 3) {
                    return {
                        color: "amber",
                        text: "Sắp đến hạn",
                        icon: Clock,
                        bgClass: "bg-amber-50",
                        borderClass: "border-amber-200",
                        textClass: "text-amber-700",
                    };
                }
                return {
                    color: "blue",
                    text: "Đang thuê",
                    icon: BookOpen,
                    bgClass: "bg-blue-50",
                    borderClass: "border-blue-200",
                    textClass: "text-blue-700",
                };
            case "overdue":
                return {
                    color: "red",
                    text: "Quá hạn",
                    icon: AlertCircle,
                    bgClass: "bg-red-50",
                    borderClass: "border-red-200",
                    textClass: "text-red-700",
                };
            case "returned":
                return {
                    color: "green",
                    text: "Đã trả",
                    icon: CheckCircle,
                    bgClass: "bg-green-50",
                    borderClass: "border-green-200",
                    textClass: "text-green-700",
                };
            default:
                return {
                    color: "gray",
                    text: "Không xác định",
                    icon: BookOpen,
                    bgClass: "bg-gray-50",
                    borderClass: "border-gray-200",
                    textClass: "text-gray-700",
                };
        }
    };

    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;

    return (
        <div className={`rounded-lg border ${statusConfig.borderClass} ${statusConfig.bgClass} p-5 transition-all hover:shadow-md`}>
            <div className="flex flex-col md:flex-row gap-5 items-center">

                <input
                    type="checkbox"
                    checked={selectedBooks.includes(book.id)}
                    onChange={onToggleSelection}
                    className={`h-5 w-5 rounded border-gray-300 text-blue-600 cursor-pointer ${book.status === 'returned' ? 'hidden' : ''}`} />
                {/* Book Cover */}
                <div className="flex-shrink-0">
                    <div className="relative">
                        <img
                            src={book.cover || "/placeholder.svg"}
                            alt={`Cover of ${book.title}`}
                            className="w-32 h-48 md:w-24 md:h-36 rounded-lg object-cover shadow-sm border border-gray-200"
                        />
                        <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bgClass} ${statusConfig.textClass} border ${statusConfig.borderClass}`}>
                            {statusConfig.text}
                        </div>
                    </div>
                </div>

                {/* Book Details */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                            <p className="text-gray-600 mt-1">Tác giả: {book.author}</p>

                            <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>Thuê: {book.rentalStartDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>Hạn: {book.rentalEndDate}</span>
                                </div>
                                {book.returnDate && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Trả: {book.returnDate}</span>
                                    </div>
                                )}
                            </div>

                            {/* Status Info */}
                            <div className="mt-4 flex items-center gap-3">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgClass} ${statusConfig.textClass}`}>
                                    <StatusIcon className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        {book.status === "overdue"
                                            ? `Quá hạn ${Math.abs(book.daysRemaining)} ngày`
                                            : book.status === "active"
                                                ? `Còn ${book.daysRemaining} ngày`
                                                : "Đã hoàn tất"}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {book.price.toFixed(2)}$
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-3 md:mt-0">
                            {book.status === "active" && (
                                <>
                                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                        <RotateCcw className="h-4 w-4" />
                                        Gia hạn
                                    </button>
                                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-300">
                                        <UndoIcon className="h-4 w-4" />
                                        Trả sách
                                    </button>
                                </>
                            )}
                            {book.status === "overdue" && (
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                                    <AlertCircle className="h-4 w-4" />
                                    Trả ngay
                                </button>
                            )}
                            {book.status === "returned" && (
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                                    <BookOpen className="h-4 w-4" />
                                    Thuê lại
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ReturnModal = ({ books, step, returnData, setReturnData, onClose, onNext, onBack, onSubmit }) => {
    return (
        <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {step > 1 && step < 4 && (
                            <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <h2 className="text-xl font-bold text-gray-900">Trả sách ({books.length} cuốn)</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                {step < 4 && (
                    <div className="px-6 pt-4">
                        <div className="flex justify-between mb-2">
                            {[1, 2, 3].map(s => (
                                <div
                                    key={s}
                                    className={`flex-1 h-2 rounded-full mx-1 transition-all ${s <= step ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-center text-sm text-gray-600">Bước {step} / 3</p>
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {/* Books Info */}
                    <div className="mb-6 space-y-2">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Sách đang trả:</h3>
                        {books.map(book => (
                            <div key={book.id} className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                                <img
                                    src={book.cover}
                                    alt={book.title}
                                    className="w-12 h-16 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 text-sm truncate">{book.title}</h4>
                                    <p className="text-xs text-gray-600">{book.author}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Hạn trả: {book.rentalEndDate}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Steps Content */}
                    {step === 1 && (
                        <Step1ReturnMethod
                            returnData={returnData}
                            setReturnData={setReturnData}
                            onNext={onNext}
                        />
                    )}
                    {step === 2 && (
                        <Step2Location
                            returnData={returnData}
                            setReturnData={setReturnData}
                            onNext={onNext}
                        />
                    )}
                    {step === 3 && (
                        <Step3Condition
                            books={books}
                            returnData={returnData}
                            setReturnData={setReturnData}
                            onSubmit={onSubmit}
                        />
                    )}
                    {step === 4 && (
                        <Step4Success books={books} onClose={onClose} />
                    )}
                </div>
            </div>
        </div>
    );
}

function Step1ReturnMethod({ returnData, setReturnData, onNext }) {
    const methods = [
        { id: 'store', name: 'Trả tại cửa hàng', icon: MapPin, desc: 'Mang sách đến cửa hàng gần nhất' },
        { id: 'pickup', name: 'Lấy tại nhà', icon: Package, desc: 'Shipper đến lấy sách tại nhà (phí 20.000đ)' }
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn phương thức trả sách</h3>
            {methods.map(method => {
                const Icon = method.icon;
                return (
                    <div
                        key={method.id}
                        onClick={() => {
                            setReturnData({ ...returnData, returnMethod: method.id });
                            onNext();
                        }}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${returnData.returnMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">{method.name}</h4>
                                <p className="text-sm text-gray-600">{method.desc}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function Step2Location({ returnData, setReturnData, onNext }) {
    if (returnData.returnMethod === 'store') {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn cửa hàng</h3>
                {stores.map(store => (
                    <div
                        key={store.id}
                        onClick={() => {
                            setReturnData({ ...returnData, returnLocation: store.name });
                            onNext();
                        }}
                        className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
                    >
                        <h4 className="font-semibold text-gray-900 mb-2">{store.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">{store.address}</p>
                        <p className="text-xs text-gray-500">Giờ mở cửa: {store.hours}</p>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin lấy hàng</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ lấy hàng</label>
                <input
                    type="text"
                    value={returnData.pickupAddress}
                    onChange={(e) => setReturnData({ ...returnData, pickupAddress: e.target.value })}
                    placeholder="Nhập địa chỉ của bạn"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                    type="tel"
                    value={returnData.pickupPhone}
                    onChange={(e) => setReturnData({ ...returnData, pickupPhone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian mong muốn</label>
                <select
                    value={returnData.pickupTime}
                    onChange={(e) => setReturnData({ ...returnData, pickupTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="morning">Sáng (8h - 12h)</option>
                    <option value="afternoon">Chiều (14h - 18h)</option>
                    <option value="evening">Tối (18h - 21h)</option>
                </select>
            </div>
            <button
                onClick={onNext}
                disabled={!returnData.pickupAddress || !returnData.pickupPhone}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
                Tiếp tục
            </button>
        </div>
    );
}

function Step3Condition({ books, returnData, setReturnData, onSubmit }) {
    const updateBookCondition = (bookId, condition) => {
        setReturnData({
            ...returnData,
            bookConditions: {
                ...returnData.bookConditions,
                [bookId]: condition
            }
        });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận tình trạng sách</h3>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                    Vui lòng kiểm tra kỹ tình trạng từng cuốn sách trước khi trả. Nếu sách có hư hỏng, bạn có thể cần thanh toán phí bồi thường.
                </div>
            </div>

            {/* Condition for each book */}
            <div className="space-y-4">
                {books.map(book => (
                    <div key={book.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={book.cover}
                                alt={book.title}
                                className="w-12 h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm truncate">{book.title}</h4>
                                <p className="text-xs text-gray-600">{book.author}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {[
                                { value: 'good', label: 'Tốt', color: 'green' },
                                { value: 'minor', label: 'Hư hỏng nhẹ', color: 'yellow' },
                                { value: 'damaged', label: 'Hư hỏng', color: 'red' }
                            ].map(condition => (
                                <label
                                    key={condition.value}
                                    className="flex items-center gap-3 cursor-pointer p-2 border border-gray-200 rounded hover:bg-gray-50"
                                >
                                    <input
                                        type="radio"
                                        name={`condition-${book.id}`}
                                        value={condition.value}
                                        checked={returnData.bookConditions[book.id] === condition.value}
                                        onChange={(e) => updateBookCondition(book.id, e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm text-gray-700">{condition.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chụp ảnh sách (tùy chọn)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 cursor-pointer transition-colors">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Nhấn để chụp ảnh tình trạng sách</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú chung (tùy chọn)</label>
                <textarea
                    value={returnData.notes}
                    onChange={(e) => setReturnData({ ...returnData, notes: e.target.value })}
                    placeholder="Thêm ghi chú về tình trạng sách..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                />
            </div>

            <button
                onClick={onSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
                Xác nhận trả sách
            </button>
        </div>
    );
}

function Step4Success({ books, onClose }) {
    return (
        <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Yêu cầu trả sách thành công!</h3>
            <p className="text-gray-600 mb-2">
                Mã yêu cầu: <span className="font-semibold">RTN{Math.floor(Math.random() * 10000)}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
                Đã tạo yêu cầu trả {books.length} cuốn sách
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-gray-800 mb-2">Bước tiếp theo:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Chúng tôi sẽ liên hệ với bạn trong vòng 2 giờ</li>
                    <li>• Chuẩn bị {books.length} cuốn sách và gói cẩn thận</li>
                    <li>• Kiểm tra email để biết thêm chi tiết</li>
                </ul>
            </div>

            <button
                onClick={onClose}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
                Đóng
            </button>
        </div>
    );
}

export default RentedBooksPage;