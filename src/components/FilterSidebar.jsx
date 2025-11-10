import React from 'react'
import { Star, SlidersHorizontal } from 'lucide-react'

const FilterSidebar = () => {
    return (
        <div>
            <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <SlidersHorizontal className="h-5 w-5 text-gray-500" />
                            <h2 className="font-semibold text-lg">Filters</h2>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Availability</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <input id="buy" type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="buy" className="text-sm text-gray-700 cursor-pointer">
                                        Available to Buy
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input id="rent" type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="rent" className="text-sm text-gray-700 cursor-pointer">
                                        Available to Rent
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Categories</h3>
                            <div className="space-y-2">
                                {[
                                    "Fiction",
                                    "Non-Fiction",
                                    "Mystery & Thriller",
                                    "Romance",
                                    "Science Fiction",
                                    "Biography",
                                    "Self-Help",
                                    "History",
                                ].map((category) => (
                                    <div key={category} className="flex items-center gap-2">
                                        <input
                                            id={category.toLowerCase().replace(/\s+/g, "-")}
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor={category.toLowerCase().replace(/\s+/g, "-")}
                                            className="text-sm text-gray-700 cursor-pointer"
                                        >
                                            {category}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Price Range</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <input id="under-10" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="under-10" className="text-sm text-gray-700 cursor-pointer">
                                        Under $10
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input id="10-20" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="10-20" className="text-sm text-gray-700 cursor-pointer">
                                        $10 - $20
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input id="20-30" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="20-30" className="text-sm text-gray-700 cursor-pointer">
                                        $20 - $30
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input id="over-30" type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <label htmlFor="over-30" className="text-sm text-gray-700 cursor-pointer">
                                        Over $30
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Rating</h3>
                            <div className="space-y-2">
                                {[4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center gap-2">
                                        <input id={`rating-${rating}`} type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                        <label
                                            htmlFor={`rating-${rating}`}
                                            className="text-sm text-gray-700 cursor-pointer flex items-center gap-1"
                                        >
                                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                            {rating}+ Stars
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                            Clear Filters
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    )
}

export default FilterSidebar
