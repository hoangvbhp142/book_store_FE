import React from 'react'

const SearchAndSort = () => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
                <input
                    type="search"
                    placeholder="Search by title, author, or ISBN..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <select defaultValue="relevance" className="w-full md:w-[200px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="title">Title: A-Z</option>
            </select>
        </div>
    )
}

export default SearchAndSort
