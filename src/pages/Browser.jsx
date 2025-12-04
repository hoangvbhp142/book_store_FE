import { useSearchParams, useLocation } from "react-router-dom";
import BookList from "../components/BookList";
import PagingBar from "../components/PagingBar";
import FilterSidebar from "../components/FilterSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { getAll } from "../stores/categorySlice";
import { toast } from "react-toastify";
import bookApi from "../api/bookApi";
import { ChevronDown } from "lucide-react";

const Browser = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.category);

    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [bookList, setBookList] = useState([]);
    const [metaData, setMetaData] = useState({});

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
        const next = {
            ...params,
            ...patch,
            filter: {
                ...params.filter,
                ...(patch.filter || {}),
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
            console.log(response);
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
            return category ? `Danh mục: ${category.name}` : "Danh mục sản phẩm";
        }
        return "Tất cả sản phẩm";
    };

    const currentSortLabel =
        sortOptions.find(opt => opt.value === params.sort)?.label || "Sắp xếp";

    // ======================
    // UI
    // ======================
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">

                    {/* Title */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                        {isSearchPage && params.q && (
                            <p className="text-gray-600 mt-2">
                                Tìm thấy {metaData?.total || 0} kết quả
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {
                            isCategoryPage ? (
                                <FilterSidebar
                                    onFilterChange={handleFilterChange}
                                    categories={categories}
                                    initialSelectedCategory={categoryIdFromPath}
                                />
                            ) : (
                                <></>
                            )
                        }

                        <div className="flex-1">

                            {/* Control bar */}
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="text-sm text-gray-600">
                                    Hiển thị{" "}
                                    <span className="font-medium text-gray-900">
                                        {bookList.length}
                                    </span>{" "}
                                    trong{" "}
                                    <span className="font-medium text-gray-900">
                                        {metaData.totalItems || 0}
                                    </span>{" "}
                                    sản phẩm
                                </div>

                                <div className="flex items-center gap-3">
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
                                <div className="text-center py-12 text-gray-600">
                                    Không tìm thấy sản phẩm nào
                                </div>
                            )}

                            <div className="mt-12 flex justify-center">
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
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 min-w-[160px] justify-between">
            {label}
            <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>

        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            {options.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`w-full text-left px-4 py-2 text-sm ${selected === opt.value
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
