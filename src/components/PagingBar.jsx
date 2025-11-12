import { ChevronLeft, ChevronRight } from 'lucide-react';

const PagingBar = ({ currentPage, totalPages, onPageChange, pageSize = 10 }) => {
    const currentBlock = Math.ceil(currentPage / pageSize);
    const startPage = (currentBlock - 1) * pageSize + 1;
    const endPage = Math.min(startPage + pageSize - 1, totalPages);

    return (
        <div className="flex items-center justify-center gap-1.5 mt-4">
            {/* Nút Previous */}
            <button
                className="flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeft size={16} />
            </button>

            {/* Dấu ... phía trước */}
            {startPage > 1 && (
                <button
                    disabled
                    className="px-2 text-sm text-gray-500 border border-transparent"
                >
                    ...
                </button>
            )}

            {/* Danh sách trang */}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1.5 border text-sm rounded-lg transition
                        ${currentPage === page
                            ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Dấu ... phía sau */}
            {endPage < totalPages && (
                <button
                    disabled
                    className="px-2 text-sm text-gray-500 border border-transparent"
                >
                    ...
                </button>
            )}

            {/* Nút Next */}
            <button
                className="flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default PagingBar;
