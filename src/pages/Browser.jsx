import { useSearchParams, useLocation, Link } from "react-router-dom";
import BookList from "../components/BookList";
import PagingBar from "../components/PagingBar";
import FilterSidebar from "../components/FilterSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { getAll } from "../stores/categorySlice";
import { toast } from "react-toastify";
import bookApi from "../api/bookApi";
import { ChevronDown, Filter, X } from "lucide-react";

const Browser = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.category);

    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [bookList, setBookList] = useState([]);
    const [metaData, setMetaData] = useState({});
    const [filterState, setFilterState] = useState({
        selectedCategories: [],
        priceRange: [],
        rating: []
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const isSearchPage = location.pathname.includes("/search");
    const isCategoryPage = location.pathname.includes("/category");

    const categoryIdFromPath = isCategoryPage
        ? location.pathname.split('/')[2]
        : null;

    // ======================
    // PARAMS SETUP
    // ======================
    const buildParamsFromURL = () => {
        const filter = {
            status: searchParams.get("status") || "PUBLISHED",
        };

        let categoryFilter = [];

        console.log("size", searchParams.getAll("categories"));

        setFilterState((prev) => ({
            ...prev,
            selectedCategories: searchParams.getAll("categories")
        }));

        console.log("searchParams", Object.fromEntries(searchParams.entries()));


        if (categoryIdFromPath) categoryFilter.push(categoryIdFromPath);

        const urlCategory = searchParams.getAll("categories");
        if (urlCategory.length > 0) categoryFilter = urlCategory;

        if (categoryFilter.length > 0) {
            filter["bookCategory.categoryId"] = categoryFilter;
        }

        return {
            sort: searchParams.get("sort") || "",
            q: searchParams.get("q") || "",
            limit: Number(searchParams.get("limit") || 12),
            page: Number(searchParams.get("page") || 1),
            filter,
        };
    };

    const [params, setParams] = useState(buildParamsFromURL);

    useEffect(() => {
        setParams(buildParamsFromURL());
    }, [location.pathname, searchParams]);

    // ======================
    // UPDATE PARAMS
    // ======================
    const updateParams = (patch) => {
        console.log(params);
        
        const next = {
            ...params,
            ...patch,
            filter: {
                ...params.filter,
                ...(patch.filter || {}),
                bookCategory: {
                    ...patch?.filter?.bookCategory 
                }
            },
        };

        // Giữ filter category khi đang ở category page
        if (isCategoryPage && categoryIdFromPath && !patch.filter?.["bookCategory.categoryId"]) {
            next.filter["bookCategory.categoryId"] = [categoryIdFromPath];
        }

        setParams(next);

        // Build query params lên URL
        const query = {};
        if (next.sort) query.sort = next.sort;
        if (next.q) query.q = next.q;
        if (next.page !== 1) query.page = next.page;
        if (next.limit !== 12) query.limit = next.limit;
        if (next.filter.status !== "PUBLISHED") query.status = next.filter.status;

        const cats = next.filter["bookCategory.categoryId"];
        if (!categoryIdFromPath && Array.isArray(cats)) {
            query.categories = cats;
        }

        setSearchParams(query);
    };

    // ======================
    // FETCH BOOK LIST
    // ======================
    const fetchBookList = async (finalParams) => {
        try {
            const response = await bookApi.getAll(finalParams);
            setBookList(response.data);
            setMetaData(response.meta);
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi tải sách");
        }
    };

    useEffect(() => {
        const finalParams = {
            ...params,
            filter: JSON.stringify(params.filter),
        };
        fetchBookList(finalParams);
    }, [params]);

    // ======================
    // FETCH CATEGORIES
    // ======================
    useEffect(() => {
        dispatch(getAll({ params: { filter: {}, limit: 10000 }, isAdmin: false }));
    }, []);

    // ======================
    // HANDLE FILTER CHANGE
    // ======================
    const handleFilterChange = useCallback(
        (filters = { selectedCategories: [], priceRange: [], rating: [] }) => {
            const f = {};

            setFilterState(filters);

            // Category
            if (filters.selectedCategories.length > 0) {
                f["bookCategory.categoryId"] = [
                    ...(categoryIdFromPath ? [categoryIdFromPath] : []),
                    ...filters.selectedCategories,
                ];
            } else if (categoryIdFromPath) {
                f["bookCategory.categoryId"] = [categoryIdFromPath];
            }

            // Price
            if (filters.priceRange.length === 2) {
                f.sellerPrice = {
                    gte: filters.priceRange[0],
                    lte: filters.priceRange[1],
                };
            }

            // Rating
            if (filters.rating.length > 0) {
                f.averageRating = { gte: Math.min(...filters.rating) };
            }

            console.log("f", f);
            

            updateParams({ page: 1, filter: f });
        },
        [categoryIdFromPath, isCategoryPage]
    );

    // ======================
    // UTILS
    // ======================
    const sortOptions = [
        { value: "title:asc", label: "Tên: A-Z" },
        { value: "title:desc", label: "Tên: Z-A" },
        { value: "sellerPrice:asc", label: "Giá: Thấp đến cao" },
        { value: "sellerPrice:desc", label: "Giá: Cao đến thấp" },
        { value: "createdAt:desc", label: "Mới nhất" },
        { value: "createdAt:asc", label: "Cũ nhất" },
    ];

    const limitOptions = [12, 24, 36, 48];

    const getPageTitle = () => {
        if (isSearchPage && params.q) return `Kết quả tìm kiếm cho: "${params.q}"`;
        if (isCategoryPage) {
            const category = categories?.find(c => c.id === categoryIdFromPath);
            return category ? `${category.name}` : "Danh mục sản phẩm";
        }
        return "Tất cả sản phẩm";
    };

    const currentSortLabel =
        sortOptions.find(opt => opt.value === params.sort)?.label || "Sắp xếp";

    console.log(filterState);


    // ======================
    // UI
    // ======================
    return (
        <div className="min-h-screen flex flex-col px-2 sm:px-4 lg:px-8">
            <main className="flex-1">
                <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">

                    {/* Title */}
                    {
                        isSearchPage && (
                            <div className="my-6 sm:my-10 text-center">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-700">Tìm kiếm</h1>
                                {isSearchPage && params.q && (
                                    <p className="text-sm sm:text-base text-gray-600 mt-2">
                                        Có {metaData?.total || 0} sản phẩm cho tìm kiếm
                                    </p>
                                )}
                            </div>
                        )
                    }

                    {!isSearchPage && (
                        <nav className="text-sm sm:text-base text-gray-600 mb-3">
                            <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                            <span className="mx-2">/</span>
                            <Link to="/store" className="hover:text-blue-600 transition-colors">Danh mục</Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900 font-medium">{getPageTitle()}</span>
                        </nav>
                    )}

                    {/* Mobile Filter Button */}
                    <div className="lg:hidden mb-3">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
                        >
                            <Filter className="h-4 w-4" />
                            <span className="font-medium">Bộ lọc</span>
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-5">
                        {/* Desktop Filter Sidebar */}
                        <div className="hidden lg:block">
                            <FilterSidebar
                                mode={isCategoryPage ? 'category' : 'search'}
                                onFilterChange={handleFilterChange}
                                categories={categories}
                                initialSelectedCategory={categoryIdFromPath}
                                filter={filterState}
                            />
                        </div>

                        {/* Mobile Filter Overlay */}
                        {isFilterOpen && (
                            <div className="fixed inset-0 z-50 lg:hidden">
                                {/* Backdrop */}
                                <div
                                    className="absolute inset-0 bg-gray-600/30"
                                    onClick={() => setIsFilterOpen(false)}
                                />

                                {/* Sidebar */}
                                <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
                                    {/* Header */}
                                    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                                        <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
                                        <button
                                            onClick={() => setIsFilterOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <X className="h-5 w-5 text-gray-600" />
                                        </button>
                                    </div>

                                    {/* Filter Content */}
                                    <div className="p-4">
                                        <FilterSidebar
                                            mode={isCategoryPage ? 'category' : 'search'}
                                            onFilterChange={handleFilterChange}
                                            categories={categories}
                                            initialSelectedCategory={categoryIdFromPath}
                                            filter={filterState}
                                        />
                                    </div>

                                    {/* Apply Button */}
                                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                                        <button
                                            onClick={() => setIsFilterOpen(false)}
                                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Áp dụng bộ lọc
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex-1 border border-gray-200 bg-white p-3 sm:p-5">

                            {/* Control bar */}
                            <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                <h1 className={`${!isSearchPage ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'} font-bold text-gray-900`}>
                                    {getPageTitle()}
                                </h1>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                                    {/* SORT */}
                                    <SortDropdown
                                        options={sortOptions}
                                        selected={params.sort}
                                        label={currentSortLabel}
                                        onChange={(value) => updateParams({ sort: value, page: 1 })}
                                    />

                                    {/* LIMIT */}
                                    <SortDropdown
                                        options={limitOptions.map(v => ({ value: v, label: `${v} sản phẩm` }))}
                                        selected={params.limit}
                                        label={`Hiển thị: ${params.limit}`}
                                        onChange={(value) => updateParams({ limit: value, page: 1 })}
                                    />
                                </div>
                            </div>

                            <BookList books={bookList} />

                            {bookList.length === 0 && (
                                <div className="text-center py-12 text-gray-600 text-sm sm:text-base">
                                    Không tìm thấy sản phẩm nào
                                </div>
                            )}

                            <div className="mt-8 sm:mt-12 flex justify-center">
                                <PagingBar
                                    currentPage={params.page}
                                    onPageChange={(page) => updateParams({ page })}
                                    pageSize={metaData.limit}
                                    totalPages={metaData.pageCount}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// ============================
// SortDropdown Component
// ============================
const SortDropdown = ({ options, selected, label, onChange }) => (
    <div className="relative group">
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 w-full sm:min-w-[160px] justify-between">
            <span className="truncate">{label}</span>
            <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
        </button>

        <div className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            {options.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm ${selected === opt.value
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    </div>
);

export default Browser;