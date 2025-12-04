import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const AdvancedPagingBar = ({
    meta,
    onPageChange,
    onLimitChange,
    pageSize = 10,
    className = "",
    showLimitOptions = true,
    limitOptions = [5, 10, 20]
}) => {
    if (!meta || meta.pageCount < 1) {
        return null;
    }

    const {
        page: currentPage,
        pageCount: totalPages,
        hasNext,
        hasPrev,
        total,
        limit
    } = meta;

    const currentBlock = Math.ceil(currentPage / 5);
    const startPage = Math.max(1, currentPage - 3);
    const endPage = Math.min(startPage + 5 - 1, totalPages);
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    console.log(currentBlock, startPage, endPage, pages);


    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {/* Thông tin tổng quan */}
            <div className="text-sm text-gray-600">
                Hiển thị <span className="font-medium">{(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, total)}</span> trong tổng số <span className="font-medium">{total}</span> bản ghi
            </div>

            <div className="flex items-center gap-4">
                {/* Chọn số lượng items/trang */}
                {showLimitOptions && onLimitChange && (
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Hiển thị:</label>
                        <select
                            value={limit}
                            onChange={(e) => {
                                onLimitChange(Number(e.target.value));
                            }}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {limitOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Điều hướng trang */}
                <div className="flex items-center gap-1.5">
                    <button
                        className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        disabled={!hasPrev}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* Các nút trang */}
                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm transition min-w-[40px]"
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="px-1 text-gray-500">...</span>}
                        </>
                    )}

                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-2 border text-sm rounded-lg transition min-w-[40px]
                ${currentPage === page
                                    ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="px-1 text-gray-500">...</span>}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm transition min-w-[40px]"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        disabled={!hasNext}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedPagingBar;