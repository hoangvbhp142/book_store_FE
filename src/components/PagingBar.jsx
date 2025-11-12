import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const PagingBar = ({ pageSize, totalPages }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const currentBlock = Math.ceil(currentPage / pageSize);
    const startPage = (currentBlock - 1) * pageSize + 1;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex items-center justify-center gap-1.5">
            {/* Nút Previous */}
            <button
                className="flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                <ChevronLeft size={16} />
            </button>

            {/* Dấu ... phía trước */}
            <button
                className={`px-2 text-sm text-gray-500 border border-transparent ${parseInt((currentPage - 1) / pageSize) === 0 ? 'hidden' : ''
                    }`}
                disabled
            >
                ...
            </button>

            {/* Danh sách trang */}
            {Array.from(
                { length: totalPages < pageSize ? totalPages : pageSize },
                (_, i) => i + startPage
            ).map((page) => (
                <button
                    key={page}
                    className={`px-3 py-1.5 border text-sm rounded-lg transition
            ${currentPage === page
                            ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </button>
            ))}

            {/* Dấu ... phía sau */}
            <button
                className={`px-2 text-sm text-gray-500 border border-transparent ${currentPage + pageSize > totalPages ? 'hidden' : ''
                    }`}
                disabled
            >
                ...
            </button>

            {/* Nút Next */}
            <button
                className="flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default PagingBar;
