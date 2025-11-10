import { Link, useParams } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle,
  Pencil
} from 'lucide-react';

import books from '../data/Books';
import { useState, useEffect } from 'react';
import Modal from '../modal/Modal';
import ReviewModel from '../modal/ReviewModel';
import { useDispatch, useSelector } from 'react-redux';
import { addItems } from '../stores/cartSlice';
import rentalOptions from '../data/rentalOption';
import { toast } from 'react-toastify';
import utils from '../app/utils'

const BookDetail = () => {
  const { id } = useParams();

  const book = books.find(item => item.id === Number(id));


  const dispatch = useDispatch();
  const { items, total, error, loading } = useSelector(state => state.cart);

  const [cartItem, setCartItem] = useState({
    book: null,
    quantity: 1,
    type: 'buy',
    price: 0,
    deposit: 0
  });

  const [activeTab, setActiveTab] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [selectedRentalDays, setSelectedRentalDays] = useState(7);

  const [moreDescription, setMoreDescription] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const openReviewModal = () => setIsReviewModalOpen(true);
  const closeReviewModal = () => setIsReviewModalOpen(false);

  const calculateRentalPrice = (days) => {
    const option = rentalOptions.find(opt => opt.days === days);
    const basePrice = book.rentalPrice * days;
    return option.price;
  };

  const fields = [
    { key: 'isbn', label: 'ISBN' },
    { key: 'publisher', label: 'Nhà xuất bản' },
    { key: 'publishYear', label: 'Năm xuất bản' },
    { key: 'pageCount', label: 'Số trang' },
    { key: 'language', label: 'Ngôn ngữ' },
    { key: 'weight', label: 'Trọng lượng' },
    { key: 'dimensions', label: 'Kích thước' },
    { key: 'category', label: 'Danh mục' },
  ];

  const addItemToCart = () => {
    dispatch(addItems({
      id: book.id,
      book: book,
      type: activeTab,
      quantity,
      price: activeTab === 'buy' ? (book.discountPrice || book.salePrice) : calculateRentalPrice(selectedRentalDays),
      deposit: activeTab === 'buy' ? 0 : book.deposit,
      image: book.image,
      rentalDays: activeTab === 'buy' ? 0 : selectedRentalDays,
      isChecked: false
    }));
    toast.success("Đã thêm vào giỏ hàng");
  }

  // useEffect(() => {
  //   if (book) {
  //     setCartItem({
  //       book: book,
  //       quantity: quantity,
  //       type: activeTab,
  //       price:
  //         activeTab === 'buy'
  //           ? (book.discountPrice || book.salePrice)
  //           : (book.rentalPrice * selectedRentalDays),
  //       deposit: activeTab === 'rent' ? book.deposit : 0
  //     });
  //   }
  // }, [book, quantity, activeTab, selectedRentalDays]);

  console.log(items);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
      <div className="container mx-auto px-4 py-6 flex-1">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link to="/store" className="hover:text-blue-600 transition-colors">Cửa hàng</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{book.title}</span>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* --- Left Column: Image + Delivery Info --- */}
            <div className="flex flex-col lg:sticky lg:top-6 lg:self-start space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-full bg-white border border-gray-200 rounded-xl p-3">
                  <img src={book.image} alt={book.title} className="w-full h-auto rounded-lg object-cover" />
                </div>
                <div className="flex gap-2 mt-3">
                  {[1, 2, 3].map((img) => (
                    <div key={img} className="w-16 h-20 bg-gray-100 border border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer p-0.5">
                      <img src={book.image} alt={`${book.title} ${img}`} className="w-full h-full object-cover rounded" />
                    </div>
                  ))}
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
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{book.title}</h1>

              {/* Rating */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="font-medium text-gray-700">4.8</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>(1,234 đánh giá)</span>
                  <span>|</span>
                  <span>Đã bán: 605</span>
                </div>
              </div>

              {/* Info Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 border-y border-gray-200">
                <div className="space-y-2">
                  <p><span className="font-medium">Nhà xuất bản:</span> {book.publisher}</p>
                  <p><span className="font-medium">Năm xuất bản:</span> {book.publishYear}</p>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">Tác giả:</span> {book.author}</p>
                  <p><span className="font-medium">Hình thức bìa:</span> {book.coverType}</p>
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
                        <span className="text-3xl font-bold text-gray-900">{utils.formatCurrency(book.discountPrice || book.salePrice)}</span>
                        {book.discountPrice && (
                          <>
                            <span className="text-xl text-gray-500 line-through">{utils.formatCurrency(book.salePrice)}</span>
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              -{Math.round((book.salePrice - book.discountPrice) * 100 / book.salePrice)}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Còn {book.quantity} sách trong kho</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4 gap-4">
                      <div className="flex gap-2 items-center">
                        <span className="text-gray-700 font-medium text-sm">Giá thuê:</span>
                        <span className="text-3xl font-bold text-gray-900">{utils.formatCurrency(calculateRentalPrice(selectedRentalDays))}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-gray-700 font-medium text-sm">Giá cọc:</span>
                        <span className="text-3xl font-bold text-gray-900">{utils.formatCurrency(book.deposit)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {rentalOptions.map((option) => (
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
                      <span>Còn {book.quantity} sách cho thuê</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity + Actions */}
              <div className="flex items-center gap-4 mt-6">
                <span className="font-semibold text-gray-700">Số lượng:</span>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100">-</button>
                  <span className="px-4 py-2 font-semibold text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100">+</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  onClick={addItemToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition">
                  <ShoppingCart className="h-5 w-5" />
                  Thêm vào giỏ hàng
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
                    {fields.map((field, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-700 w-1/3">{field.label}</td>
                        <td className="px-6 py-3 text-gray-900">{book[field.key] || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Mô tả sản phẩm</h2>
                <div className="relative">
                  <p className={`text-gray-700 leading-relaxed text-base transition-all duration-300 ${moreDescription ? '' : 'line-clamp-3'}`}>
                    {book.description}
                  </p>
                  {!moreDescription && <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent"></div>}
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setMoreDescription(!moreDescription)}
                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                  >
                    {moreDescription ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 items-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">4.8</div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-gray-500 text-sm">1,234 đánh giá</div>
            </div>

            <div className="lg:col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-10">{rating} sao</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${(rating / 5) * 100}%` }}></div>
                  </div>
                  <span className="text-sm text-gray-500 w-12">{(rating / 5 * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                className="w-full flex items-center justify-center gap-1 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl px-4 py-2 font-medium transition"
                onClick={openReviewModal}
              >
                <Pencil className="w-5 h-5" />
                Viết đánh giá
              </button>
              <Modal isOpen={isReviewModalOpen} onClose={closeReviewModal} title="ĐÁNH GIÁ SẢN PHẨM">
                <ReviewModel onClose={closeReviewModal} />
              </Modal>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {[1, 2, 3].map((review) => (
              <div key={review} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">Reader Name</span>
                      <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">Đã mua</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2 ngày trước</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Sách rất hay, đáng đọc!</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Câu chuyện cuốn hút, nhân vật sâu sắc và văn phong mượt mà. Một cuốn sách đáng để thêm vào tủ sách của bạn.
                </p>
              </div>
            ))}
            <button className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition font-medium text-sm">
              Xem thêm đánh giá
            </button>
          </div>
        </div>

        {/* Related Books */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sách tương tự</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Link
                key={i}
                to={`/book/${i + 10}`}
                className="group block bg-white border border-gray-200 rounded-xl hover:border-blue-400 transition overflow-hidden"
              >
                <div className="aspect-[2/3] bg-gray-100 overflow-hidden">
                  <img
                    src={`https://via.placeholder.com/300x400?text=Related+Book+${i}`}
                    alt={`Related Book ${i}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition">{`Similar Book ${i}`}</h3>
                  <p className="text-xs text-gray-600 mb-1">Tác giả A</p>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">4.{i}</span>
                  </div>
                  <span className="font-bold text-sm text-gray-900">${(20 + i * 2).toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>

  );
}


export default BookDetail;