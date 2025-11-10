import { ArrowLeft, Calendar, Clock, AlertCircle, RotateCcw, UndoIcon } from "lucide-react"
import sach1 from '../assets/sach1.jpg'


// Mock data - replace with actual API call
const mockRentals = [
    {
        id: "1",
        title: "The Midnight Library",
        author: "Matt Haig",
        cover: sach1,
        rentalStartDate: "October 26, 2025",
        rentalEndDate: "November 9, 2025",
        daysRemaining: 12,
        isOverdue: false,
        price: 4.99,
    },
    {
        id: "2",
        title: "Educated",
        author: "Tara Westover",
        cover: sach1,
        rentalStartDate: "October 20, 2025",
        rentalEndDate: "November 3, 2025",
        daysRemaining: 4,
        isOverdue: false,
        price: 4.99,
    },
    {
        id: "3",
        title: "Project Hail Mary",
        author: "Andy Weir",
        cover: sach1,
        rentalStartDate: "October 10, 2025",
        rentalEndDate: "October 24, 2025",
        daysRemaining: -6,
        isOverdue: true,
        price: 5.99,
    },
]

export function RentedBooksPage() {
    const activeRentals = mockRentals.filter((book) => !book.isOverdue)
    const overdueRentals = mockRentals.filter((book) => book.isOverdue)

    const getStatusBadge = (book) => {
        if (book.isOverdue)
            return <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium">Overdue</span>
        if (book.daysRemaining <= 3)
            return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">Due Soon</span>
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Active</span>
    }

    return (
        <main className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="px-4 py-5 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Sách tôi đang thuê</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {mockRentals.length} active rental{mockRentals.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <section className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
                {/* Overdue Alert */}
                {overdueRentals.length > 0 && (
                    <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-lg">
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-800">
                                    You have {overdueRentals.length} overdue book
                                    {overdueRentals.length !== 1 ? "s" : ""}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Please return or renew your overdue rentals to avoid additional fees.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rentals List */}
                {mockRentals.length > 0 ? (
                    <div className="bg-white border border-gray-100 rounded-lg divide-y divide-gray-100 shadow-sm">
                        {mockRentals.map((book) => (
                            <RentalBookRow key={book.id} book={book} statusBadge={getStatusBadge(book)} />
                        ))}
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white">
                        <div className="mb-4">
                            <RotateCcw className="h-6 w-6 mx-auto text-gray-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">No active rentals</h2>
                            <p className="text-gray-500 mb-4">
                                You don't have any rented books at the moment. Browse our collection to rent your next book.
                            </p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Browse Books
                        </button>
                    </div>
                )}
            </section>
        </main>
    )

}

function RentalBookRow({ book, statusBadge }) {
    return (
        <div
            key={book.id}
            className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 transition-colors ${book.isOverdue
                ? "bg-red-50"
                : book.daysRemaining <= 3
                    ? "bg-amber-50"
                    : "hover:bg-gray-50"
                }`}
        >
            {/* Cover */}
            <img
                src={book.cover || "/placeholder.svg"}
                alt={`Cover of ${book.title}`}
                className="h-32 w-24 sm:h-20 sm:w-14 rounded object-cover ring-1 ring-gray-200 flex-shrink-0 mx-auto sm:mx-0"
            />

            {/* Details */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                        <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                    <div className="flex justify-center sm:justify-end">
                        {book.isOverdue ? (
                            <span className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
                                Quá hạn
                            </span>
                        ) : book.daysRemaining <= 3 ? (
                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                                Sắp đến hạn
                            </span>
                        ) : (
                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                Đang thuê
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-center sm:justify-start gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <Calendar className="h-3.5 w-3.5" />
                        {book.rentalStartDate} → {book.rentalEndDate}
                    </div>
                    <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <Clock className="h-3.5 w-3.5" />
                        <span className={book.isOverdue ? "text-red-600 font-medium" : ""}>
                            {book.isOverdue
                                ? `${Math.abs(book.daysRemaining)} days overdue`
                                : `${book.daysRemaining} days remaining`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3 sm:mt-0 sm:flex-col w-full sm:w-28">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Gia hạn</span>
                </button>
                <button className="flex-1 px-3 py-2 bg-transparent text-gray-700 text-sm rounded-md hover:bg-gray-100 transition-colors border border-gray-300 flex items-center justify-center gap-1">
                    <UndoIcon className="h-3.5 w-3.5" />
                    <span>Trả sách</span>
                </button>
            </div>
        </div>
    )
}
