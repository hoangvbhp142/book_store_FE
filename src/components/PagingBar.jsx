import { useState } from 'react'
const PagingBar = ({pageSize, totalPages}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const currentBlock = Math.ceil(currentPage / pageSize);

    const startPage = (currentBlock - 1) * pageSize + 1;
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    console.log(currentPage);

    return (
        <div className="flex items-center justify-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}>
                Previous
            </button>
            <button className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            ${parseInt((currentPage - 1) / pageSize) === 0 ? 'hidden' : ''}`} disabled>
                ...
            </button>
            {
                Array.from({ length: totalPages < pageSize ? totalPages : pageSize }, (_, i) => i + startPage).map((page) => (
                    <button className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700
                        ${currentPage === page ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
                        onClick={() => handlePageChange(page)}
                        key={page}>
                        {page}
                    </button>
                ))
            }
            <button className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            ${currentPage + pageSize > totalPages ? 'hidden' : ''}`} disabled
                onClick={() => handlePageChange(currentPage - 1)}>
                ...
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}>
                Next
            </button>
        </div>
    )
}

export default PagingBar
