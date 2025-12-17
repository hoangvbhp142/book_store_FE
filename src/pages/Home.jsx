import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBooks } from '../stores/bookSlice'
import banners from '../data/Banner';
import BannerCarousel from '../components/BannerCarousel';
import BannerGrid from '../components/BannerGrid';
import SimpleFilterSidebar from '../components/SimpleFilterSidebar';
import { getAll } from '../stores/categorySlice';
import { buildTree } from '../app/utils';
import BookList from '../components/BookList';
import FeaturedBook from '../components/FeaturedBook';
import PositionedBanner from '../components/PositionedBanner';
import bannerApi from '../api/bannerApi';

const Home = () => {
  const dispatch = useDispatch();
  const { bookList, loading, error } = useSelector(state => state.books);
  const { categories: categoryList } = useSelector(state => state.category);

  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [bestSellerBooks, setBestSellerBooks] = useState([]);
  const [kidsBooks, setKidsBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);

  const [homeMainBanners, setHomeMainBanners] = useState([]);
  const [homeSubBanners, setHomeSubBanners] = useState([]);
  const [homeMiddleBanners, setHomeMiddleBanners] = useState([]);
  const [homeBottomBanners, setHomeBottomBanners] = useState([]);

  const [sidebarTopBanners, setSidebarTopBanners] = useState([]);
  const [sidebarBottomBanners, setSidebarBottomBanners] = useState([]);

  const [categoryHeaderBanners, setCategoryHeaderBanners] = useState([]);
  const [productDetailBanners, setProductDetailBanners] = useState([]);
  const [cartBanners, setCartBanners] = useState([]);


  const fetchBookByCategory = (categoryName, setter) => {
    const filteredBooks = bookList.filter(book =>
      book.bookCategories.some(category => category.category.name === categoryName)
    );
    setter(filteredBooks);
  }

  const fetchBanner = async () => {
    try {
      const response = await bannerApi.getAll();

      const homeMain = [];
      const homeSub = [];
      const homeMiddle = [];
      const homeBottom = [];

      const sidebarTop = [];
      const sidebarBottom = [];

      const categoryHeader = [];
      const productDetail = [];
      const cart = [];

      response.data.forEach(banner => {
        switch (banner.position) {
          case 'HOME_MAIN':
            homeMain.push(banner);
            break;
          case 'HOME_SUB':
            homeSub.push(banner);
            break;
          case 'HOME_MIDDLE':
            homeMiddle.push(banner);
            break;
          case 'HOME_BOTTOM':
            homeBottom.push(banner);
            break;

          case 'SIDEBAR_TOP':
            sidebarTop.push(banner);
            break;
          case 'SIDEBAR_BOTTOM':
            sidebarBottom.push(banner);
            break;

          case 'CATEGORY_HEADER':
            categoryHeader.push(banner);
            break;
          case 'PRODUCT_DETAIL':
            productDetail.push(banner);
            break;
          case 'CART':
            cart.push(banner);
            break;

          default:
            break;
        }
      });

      setHomeMainBanners(homeMain);
      setHomeSubBanners(homeSub);
      setHomeMiddleBanners(homeMiddle);
      setHomeBottomBanners(homeBottom);

      setSidebarTopBanners(sidebarTop);
      setSidebarBottomBanners(sidebarBottom);

      setCategoryHeaderBanners(categoryHeader);
      setProductDetailBanners(productDetail);
      setCartBanners(cart);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookList = () => {
    const finalParams = {
      filter: JSON.stringify({ status: "PUBLISHED" })
    }
    dispatch(fetchBooks({ params: finalParams, isAdmin: false }));
  }

  const fetchCategoryList = () => {
    dispatch(getAll({
      params: {
        filter: {},
        limit: 10000
      }, isAdmin: false
    }));
  }

  useEffect(() => {
    fetchBookList();
    fetchCategoryList();
    fetchBanner();

    console.log(bookList);

    fetchBookByCategory("Văn học", setKidsBooks);
  }, []);

  useEffect(() => {
    fetchBookByCategory("Văn học", setKidsBooks);
  }, [bookList]);

  // Danh sách danh mục từ image.png
  const categories = [
    "Sách Kinh Tế",
    "Sách Văn Học Trong Nước",
    "Sách Văn Học Nước Ngoài",
    "Sách Thường Thức Đời Sống",
    "Sách Thiếu Nhi",
    "Sách Phát Triển Bản Thân",
    "Sách Tin Học Ngoại Ngữ",
    "Sách Chuyên Ngành",
    "Sách Giáo Khoa - Giáo Trình",
    "Sách Phát Hành 2024",
    "Sách Mới 2025",
    "Review Sách"
  ];

  // Giả sử chúng ta lấy cuốn sách đầu tiên trong bookList làm sách nổi bật
  const featuredBook = bookList[0] || {};

  console.log(homeSubBanners);


  return (
    <div className="">
      {/* --- Main Content --- */}
      <section className="flex flex-col min-h-screen bg-[#f9f5ee]">
        <div className="container mx-auto md:px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* --- Danh mục --- */}
            <div className="md:col-span-1 space-y-3">
              <SimpleFilterSidebar categories={buildTree(categoryList)} />
              <div className="hidden md:block">
                <PositionedBanner banners={sidebarTopBanners} />
                <FeaturedBook bookList={bookList} />
              </div>

            </div>

            {/* --- Featured Book --- */}
            <div className="md:col-span-3">
              <BannerCarousel banners={homeMainBanners} />

              <div className='mt-4'>
                <BannerGrid banners={homeSubBanners} />
              </div>

              <h2 className="text-2xl font-medium p-3">Sách Nổi Bật</h2>
              <div className="bg-white p-3">
                <BookList books={bookList} />
              </div>

              <div className='mt-4 mb-4'>
                <BannerGrid banners={homeMiddleBanners} />
              </div>

              <h2 className="text-2xl font-medium p-3">Sách thiếu nhi</h2>
              <div className="bg-white p-3">
                <BookList books={kidsBooks} />
              </div>

              <h2 className="text-2xl font-medium p-3">Truyện tranh</h2>
              <div className="bg-white p-3">
                <BookList books={kidsBooks} />
              </div>
            </div>
          </div>
        </div>

        {/* FeaturedBook chỉ hiện trên mobile + tablet */}
        <div className="md:hidden md:px-4 mt-4">
          <PositionedBanner banners={banners} />
          <FeaturedBook bookList={bookList} />
        </div>

      </section>
    </div>
  )
}

export default Home;