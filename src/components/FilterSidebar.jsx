import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, Star, ChevronDown, ChevronRight } from 'lucide-react';
import { getAll } from '../stores/categorySlice';

// Component đệ quy cho danh mục
const CategoryNode = ({ category, expandedCategories, selectedCategories, onToggleExpand, onCategoryCheck }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.includes(category.id);
    const isChecked = selectedCategories.includes(category.id);

    const handleToggle = () => {
        onToggleExpand(category.id);
    };

    const handleCheck = () => {
        onCategoryCheck(category.id);
    };

    return (
        <div className="ml-2">
            <div className="flex items-center gap-2 py-1">
                {hasChildren ? (
                    <button onClick={handleToggle} className="p-0.5">
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                ) : (
                    <span className="w-4"></span>
                )}
                <input
                    id={`category-${category.id}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheck}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm text-gray-700 cursor-pointer flex-1 truncate"
                >
                    {category.name}
                </label>
            </div>
            {hasChildren && isExpanded && (
                <div className="ml-2">
                    {category.children.map(child => (
                        <CategoryNode
                            key={child.id}
                            category={child}
                            expandedCategories={expandedCategories}
                            selectedCategories={selectedCategories}
                            onToggleExpand={onToggleExpand}
                            onCategoryCheck={onCategoryCheck}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const FilterSidebar = ({ onFilterChange, categories, mode, filter }) => {

    // State cho bộ lọc
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(filter?.selectedCategories || []);
    const [priceRange, setPriceRange] = useState(filter?.priceRange || []);
    const [rating, setRating] = useState(filter?.rating || []);

    // Xây dựng cây danh mục từ danh sách phẳng
    const categoryTree = useMemo(() => {
        if (!categories || categories.length === 0) return [];

        // Tạo một bản đồ để truy cập nhanh
        const map = {};
        const roots = [];

        // Khởi tạo mỗi node với mảng children rỗng
        categories.forEach(category => {
            map[category.id] = { ...category, children: [] };
        });

        // Gán từng node vào cha của nó
        categories.forEach(category => {
            if (category.parentId) {
                const parent = map[category.parentId];
                if (parent) {
                    parent.children.push(map[category.id]);
                }
            } else {
                roots.push(map[category.id]);
            }
        });

        return roots;
    }, [categories]);

    // Hàm xử lý mở/rộng danh mục
    const handleToggleExpand = (categoryId) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Hàm xử lý chọn danh mục
    const handleCategoryCheck = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Hàm xử lý thay đổi khoảng giá
    const handlePriceRangeChange = (rangeValue, checked) => {
        setPriceRange(prev =>
            checked
                ? [...prev, rangeValue]
                : prev.filter(r => r !== rangeValue)
        );
    };

    // Hàm xử lý thay đổi rating
    const handleRatingChange = (ratingValue, checked) => {
        setRating(prev =>
            checked
                ? [...prev, ratingValue]
                : prev.filter(r => r !== ratingValue)
        );
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedCategories([]);
        setPriceRange([]);
        setRating([]);
    };

    // Price ranges
    const priceRanges = [
        { id: 'under-100000', label: '0đ - 150,000đ', value: '0-150000' },
        { id: '100000-200000', label: '150,000đ - 300,000đ', value: '150000-300000' },
        { id: '200000-300000', label: '300,000đ - 500,000đ', value: '300000-500000' },
        { id: '300000-500000', label: '500,000đ - 700,000đ', value: '500000-700000' },
        { id: 'over-500000', label: '700,000đ - Trở Lên', value: '700000-' }
    ];

    // Ratings
    const ratings = [4, 3, 2, 1];

    useEffect(() => {
        onFilterChange({
            selectedCategories,
            priceRange,
            rating
        });
        console.log("fetch");

    }, [selectedCategories, priceRange, rating]);

    return (
        <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="h-5 w-5 text-gray-500" />
                            <h2 className="font-semibold text-lg">Bộ lọc</h2>
                        </div>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Xóa hết
                        </button>
                    </div>

                    {/* Categories Filter */}
                    {
                        mode === 'search' && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">Danh mục</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {categoryTree.length > 0 ? (
                                        categoryTree.map(category => (
                                            <CategoryNode
                                                key={category.id}
                                                category={category}
                                                expandedCategories={expandedCategories}
                                                selectedCategories={selectedCategories}
                                                onToggleExpand={handleToggleExpand}
                                                onCategoryCheck={handleCategoryCheck}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Không có danh mục nào</p>
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* Price Range Filter */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Giá</h3>
                        <div className="space-y-2">
                            {priceRanges.map((range) => (
                                <div key={range.id} className="flex items-center gap-2">
                                    <input
                                        id={range.id}
                                        type="checkbox"
                                        checked={priceRange.includes(range.value)}
                                        onChange={(e) => handlePriceRangeChange(range.value, e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor={range.id} className="text-sm text-gray-700 cursor-pointer">
                                        {range.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Đánh giá</h3>
                        <div className="space-y-2">
                            {ratings.map((ratingValue) => (
                                <div key={ratingValue} className="flex items-center gap-2">
                                    <input
                                        id={`rating-${ratingValue}`}
                                        type="checkbox"
                                        checked={rating.includes(ratingValue)}
                                        onChange={(e) => handleRatingChange(ratingValue, e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor={`rating-${ratingValue}`}
                                        className="text-sm text-gray-700 cursor-pointer flex items-center gap-1"
                                    >
                                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                        {ratingValue}+ Sao
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Filters Count */}
                    {/* {(selectedCategories.length > 0 ||
                        priceRange.length > 0 ||
                        rating.length > 0) && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    Đang chọn: {[
                                        selectedCategories.length > 0 && `${selectedCategories.length} danh mục`,
                                        priceRange.length > 0 && `${priceRange.length} khoảng giá`,
                                        rating.length > 0 && `${rating.length} mức đánh giá`
                                    ].filter(Boolean).join(', ')}
                                </p>
                            </div>
                        )} */}
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;