import { Link, useParams } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle,
  Pencil
} from 'lucide-react';

import { useState, useEffect } from 'react';
import Modal from '../modal/Modal';
import ReviewModel from '../modal/ReviewModel';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../stores/cartSlice';
import { toast } from 'react-toastify';
import utils from '../app/utils'
import { fetchBookById } from '../stores/bookSlice';
import { fetchReviews, createReview } from '../stores/reviewSlice';
import StarRating from '../components/StarRating';
import bookApi from '../api/bookApi';
import BookList from '../components/BookList';

const BookDetail = () => {
  // ==================== HOOKS ====================
  const { id } = useParams();
  const dispatch = useDispatch();

  // Redux selectors
  const { items: reviewList, loading: reviewsLoading } = useSelector(state => state.review);
  const { selectedBook } = useSelector(state => state.books);

  // Local states
  const [activeTab, setActiveTab] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [selectedRentalDays, setSelectedRentalDays] = useState(7);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [moreDescription, setMoreDescription] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);

  // ==================== COMPUTED VALUES ====================
  const ratingStats = calculateRatingStats();
  const rentalOptions = getRentalOptions();

  // ==================== UTILITY FUNCTIONS ====================
  const buildParamsFromURL = (categories) => {
    const filter = { status: "PUBLISHED" };
    const categoryFilter = categories.map(cat => cat.categoryId);

    if (categoryFilter.length > 0) {
      filter["bookCategory.categoryId"] = categoryFilter;
    }

    return {
      sort: "",
      q: "",
      limit: 4,
      page: 1,
      filter,
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 ngày trước';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} tuần trước`;
    return `${Math.ceil(diffDays / 30)} tháng trước`;
  };

  // ==================== DATA CALCULATION ====================
  function calculateRatingStats() {
    if (!reviewList || reviewList.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const totalRating = reviewList.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviewList.length;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewList.forEach(review => {
      distribution[review.rating]++;
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviewList.length,
      ratingDistribution: distribution
    };
  }

  function getRentalOptions() {
    if (!selectedBook) return [];

    return [
      { days: 1, label: '1 ngày', price: parseFloat(selectedBook.rentPricePerDay) },
      { days: 7, label: '1 tuần', price: parseFloat(selectedBook.rentPricePerWeek) },
      { days: 30, label: '1 tháng', price: parseFloat(selectedBook.rentPricePerMonth) }
    ];
  }

  const calculateRentalPrice = (days) => {
    const option = rentalOptions.find(opt => opt.days === days);
    return option ? option.price : 0;
  };

  const calculateRentalPenalty = (days) => {
    const penaltyMap = {
      1: selectedBook?.rentPenaltyPerDay,
      7: selectedBook?.rentPenaltyPerWeek,
      30: selectedBook?.rentPenaltyPerMonth
    };
    return parseFloat(penaltyMap[days] || 0);
  };

  // ==================== DATA GETTERS ====================
  const getPublishedYear = () => {
    if (!selectedBook?.publishedAt) return '—';
    return new Date(selectedBook.publishedAt).getFullYear();
  };

  const getCategoryNames = () => {
    if (!selectedBook?.bookCategories) return '—';
    return selectedBook.bookCategories.map(cat => cat.category.name).join(', ');
  };

  const getAuthorNames = () => {
    if (!selectedBook?.bookAuthors) return '—';
    return selectedBook.bookAuthors.map(author => author.author.name).join(', ');
  };

  // ==================== API CALLS ====================
  const fetchData = async () => {
    if (!id) return;

    const reviewParam = {
      sort: "createdAt:desc",
      filter: JSON.stringify({ bookId: id }),
      limit: 5,
      page: currentReviewPage
    };

    try {
      await Promise.all([
        dispatch(fetchBookById({ id })),
        dispatch(fetchReviews(reviewParam)),
      ]);
      console.log("Fetch data successfully!");
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const fetchSimilarBooks = async (categories) => {
    try {
      const params = buildParamsFromURL(categories);
      const finalParams = {
        ...params,
        filter: JSON.stringify(params.filter),
      };
      const response = await bookApi.getAll(finalParams, false);
      setSimilarBooks(response.data.filter(book => book.id !== selectedBook.id));
    } catch (error) {
      console.error("Failed to fetch similar books:", error);
    }
  };

  const loadMoreReviews = async () => {
    const nextPage = currentReviewPage + 1;
    const reviewParam = {
      sort: "createdAt:desc",
      filter: JSON.stringify({ bookId: id }),
      limit: 2,
      page: currentReviewPage
    };
    console.log("Clicked!");

    setCurrentReviewPage(nextPage);
    try {
      await dispatch(fetchReviews(reviewParam)).unwrap();
    }
    catch (error) {
      console.error("Failed to load more reviews:", error);
    }
  }

  // ==================== EVENT HANDLERS ====================
  const openReviewModal = () => {
    if (!localStorage.getItem('userData')) {
      toast.error('Vui lòng đăng nhập để viết đánh giá!');
      return;
    }
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => setIsReviewModalOpen(false);

  const addItemToCart = async () => {
    const user = localStorage.getItem('userData');

    // Validation
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }

    if (!selectedBook) {
      toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại!');
      return;
    }

    if (quantity > selectedBook.stockQty) {
      toast.error(`Số lượng vượt quá tồn kho. Chỉ còn ${selectedBook.stockQty} sản phẩm!`);
      return;
    }

    // Prepare cart data
    const cartData = {
      bookId: selectedBook.id,
      type: activeTab === 'buy' ? 'PURCHASE' : 'RENTAL',
      quantity: quantity,
    };

    // Add rental type if renting
    if (activeTab === 'rent') {
      const rentalTypeMap = {
        1: 'DAILY',
        7: 'WEEKLY',
        30: 'MONTHLY'
      };
      cartData.rentalType = rentalTypeMap[selectedRentalDays];
    }

    try {
      await dispatch(addToCart(cartData)).unwrap();
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng!');
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await dispatch(createReview(reviewData)).unwrap();
      closeReviewModal();
      toast.success('Đánh giá của bạn đã được gửi thành công!');

      // Refresh reviews list
      const reviewParam = {
        sort: "createdAt:desc",
        filter: JSON.stringify({ bookId: id }),
        limit: 5,
        page: 1
      };
      dispatch(fetchReviews(reviewParam));
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!');
    }
  };

  // ==================== EFFECTS ====================
  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!selectedBook?.bookCategories) return;
    fetchSimilarBooks(selectedBook.bookCategories);
  }, [selectedBook]);

  // ==================== RENDER ====================
  // Loading state
  if (!selectedBook) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin sách...</p>
        </div>
      </div>
    );
  }

  console.log(selectedBook);
  
  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      <div className="container mx-auto px-4 py-6 flex-1">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link to="/store" className="hover:text-blue-600 transition-colors">Cửa hàng</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{selectedBook.title}</span>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* --- Left Column: Image + Delivery Info --- */}
            <div className="flex flex-col lg:sticky lg:top-6 lg:self-start space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-full bg-white border border-gray-200 rounded-xl p-3">
                  <img
                    src={selectedBook.photoUrl.replace("http://minio:9000", "http://localhost:9000")}
                    alt={selectedBook.title}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {/* Hiển thị các ảnh phụ từ mediaPaths nếu có */}
                  {selectedBook.mediaUrls && selectedBook.mediaUrls.length > 0 ? (
                    selectedBook.mediaUrls.map((media, index) => (
                      <div key={index} className="w-16 h-20 bg-gray-100 border border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer p-0.5">
                        <img
                          src={media.replace("http://minio:9000", "http://localhost:9000")}
                          alt={`${selectedBook.title} ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))
                  ) : (
                    // Fallback: hiển thị ảnh chính nếu không có ảnh phụ
                    [1].map((img) => (
                      <div key={img} className="w-16 h-20 bg-gray-100 border border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer p-0.5">
                        <img
                          src={selectedBook.photoUrl.replace("http://minio:9000", "http://localhost:9000")}
                          alt={`${selectedBook.title} ${img}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-gray-900">Thông tin giao hàng</h3>
                {[
                  {
                    icon: <Truck className="h-4 w-4 text-blue-600" />,
                    title: 'Miễn phí vận chuyển',
                    desc: 'Cho đơn hàng từ $50',
                    color: 'bg-blue-100',
                  },
                  {
                    icon: <Clock className="h-4 w-4 text-green-600" />,
                    title: 'Giao hàng nhanh',
                    desc: '2-3 ngày làm việc',
                    color: 'bg-green-100',
                  },
                  {
                    icon: <CheckCircle className="h-4 w-4 text-purple-600" />,
                    title: 'Đổi trả dễ dàng',
                    desc: 'Trong vòng 7 ngày',
                    color: 'bg-purple-100',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Right Column: Book Details --- */}
            <div className="space-y-6 lg:col-span-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{selectedBook.title}</h1>

              {/* Rating */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <StarRating rating={ratingStats.averageRating} />
                  <span className="font-medium text-gray-700">{ratingStats.averageRating}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>({ratingStats.totalReviews} đánh giá)</span>
                  <span>|</span>
                  <span>Đã bán: 605</span>
                </div>
              </div>

              {/* Info Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-y border-gray-200">
                <div className="space-y-2">
                  <p><span className="font-medium">Nhà xuất bản:</span> {selectedBook.publisher?.name || '—'}</p>
                  <p><span className="font-medium">Năm xuất bản:</span> {getPublishedYear()}</p>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">Tác giả:</span> {getAuthorNames()}</p>
                  <p><span className="font-medium">Hình thức bìa:</span> {selectedBook.status}</p>
                </div>
              </div>

              {/* Buy / Rent Tabs */}
              <div className="mt-8">
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setActiveTab('buy')}
                    className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 rounded-t-lg transition-all ${activeTab === 'buy'
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Mua sách
                  </button>
                  <button
                    onClick={() => setActiveTab('rent')}
                    className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 rounded-t-lg transition-all ${activeTab === 'rent'
                      ? 'border-green-600 text-green-600 bg-green-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <Clock className="h-4 w-4" />
                    Thuê sách
                  </button>
                </div>

                {/* Buy or Rent Section */}
                {activeTab === 'buy' ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-gray-700 font-medium">Giá mua:</span>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-gray-900">
                          {utils.formatCurrency(parseFloat(selectedBook.sellerPrice))}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Còn {selectedBook.stockQty} sách trong kho</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4 gap-4">
                      <div className="flex gap-2 items-center">
                        <span className="text-gray-700 font-medium text-sm">Giá thuê:</span>
                        <span className="text-3xl font-bold text-gray-900">
                          {utils.formatCurrency(calculateRentalPrice(selectedRentalDays))}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-gray-700 font-medium text-sm">Tiền phạt:</span>
                        <span className="text-xl font-bold text-gray-900">
                          {utils.formatCurrency(calculateRentalPenalty(selectedRentalDays))}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {getRentalOptions().map((option) => (
                        <button
                          key={option.days}
                          onClick={() => setSelectedRentalDays(option.days)}
                          className={`p-2 rounded-lg border text-sm font-medium transition-all ${selectedRentalDays === option.days
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'border-gray-200 bg-white hover:border-green-400'
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Còn {selectedBook.stockQty} sách cho thuê</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity + Actions */}
              <div className="flex items-center gap-4 mt-6">
                <span className="font-semibold text-gray-700">Số lượng:</span>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-semibold text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  onClick={addItemToCart}
                  disabled={selectedBook.stockQty === 0}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${selectedBook.stockQty === 0
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {selectedBook.stockQty === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition">
                  <Truck className="h-5 w-5" />
                  {activeTab === 'buy' ? 'Mua ngay' : 'Thuê ngay'}
                </button>
              </div>

              {/* Book Information */}
              <div className="mt-8 bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 px-6 py-4 border-b border-gray-200 bg-gray-50">
                  Thông tin chi tiết
                </h2>
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-700 w-1/3">ISBN</td>
                      <td className="px-6 py-3 text-gray-900">{selectedBook.isbn || '—'}</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-700 w-1/3">Nhà xuất bản</td>
                      <td className="px-6 py-3 text-gray-900">{selectedBook.publisher?.name || '—'}</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-700 w-1/3">Năm xuất bản</td>
                      <td className="px-6 py-3 text-gray-900">{getPublishedYear()}</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-700 w-1/3">Số trang</td>
                      <td className="px-6 py-3 text-gray-900">{selectedBook.page || '—'}</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-700 w-1/3">Ngôn ngữ</td>
                      <td className="px-6 py-3 text-gray-900">{selectedBook.language || '—'}</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-700 w-1/3">Trọng lượng</td>
                      <td className="px-6 py-3 text-gray-900">{selectedBook.weight ? `${selectedBook.weight}g` : '—'}</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-700 w-1/3">Danh mục</td>
                      <td className="px-6 py-3 text-gray-900">{getCategoryNames()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Mô tả sản phẩm</h2>
                <div className="relative">
                  <p className={`text-gray-700 leading-relaxed text-base transition-all duration-300 ${moreDescription ? '' : 'line-clamp-3'}`}>
                    {selectedBook.description || 'Chưa có mô tả cho sản phẩm này.'}
                  </p>
                  {!moreDescription && <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent"></div>}
                </div>
                {selectedBook.description && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setMoreDescription(!moreDescription)}
                      className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                    >
                      {moreDescription ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 items-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{ratingStats.averageRating}</div>
              <div className="flex justify-center mb-2">
                <StarRating rating={ratingStats.averageRating} />
              </div>
              <div className="text-gray-500 text-sm">{ratingStats.totalReviews} đánh giá</div>
            </div>

            <div className="lg:col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingStats.ratingDistribution[rating];
                const percentage = ratingStats.totalReviews > 0 ? (count / ratingStats.totalReviews) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-10">{rating} sao</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-12">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <button
                className="w-full flex items-center justify-center gap-1 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl px-4 py-2 font-medium transition"
                onClick={openReviewModal}
              >
                <Pencil className="w-5 h-5" />
                Viết đánh giá
              </button>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {reviewsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Đang tải đánh giá...</p>
              </div>
            ) : reviewList && reviewList.length > 0 ? (
              <>
                {reviewList.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {review.user?.name || 'Người dùng ẩn danh'}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                            Đã mua
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${review.rating >= star
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-300 text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {review.body}
                    </p>
                  </div>
                ))}

                {/* Hiển thị nút "Xem thêm" nếu có nhiều reviews hơn */}
                {reviewList.length >= 5 && (
                  <button
                    onClick={loadMoreReviews}
                    disabled={reviewsLoading}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition font-medium text-sm disabled:opacity-50"
                  >
                    {reviewsLoading ? 'Đang tải...' : 'Xem thêm đánh giá'}
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!
              </div>
            )}
          </div>
        </div>

        {/* Related Books */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sách tương tự</h2>
          <BookList books={similarBooks} />
        </section>

        {/* Review Modal */}
        <Modal isOpen={isReviewModalOpen} onClose={closeReviewModal} title="ĐÁNH GIÁ SẢN PHẨM">
          <ReviewModel
            onClose={closeReviewModal}
            onSubmit={handleSubmitReview}
            bookId={id}
          />
        </Modal>
      </div>
    </div>
  );
}

export default BookDetail;