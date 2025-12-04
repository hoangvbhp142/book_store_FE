import './App.css'

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'

import Home from './pages/Home'
import BookDetail from './pages/BookDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Browser from './pages/Browser'
import RentPage from './pages/RentPage'
import Account from './pages/Account'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminRentalsPage from './pages/admin/AdminRentalsPage'
import AdminBooksPage from './pages/admin/AdminBooksPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminLayout from './layout/AdminLayout'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AddBookPage from './pages/admin/AddBookPage'
import UpdateBookPage from './pages/admin/UpdateBookPage'
import CustomerLayout from './layout/CustomerLayout'
import CustomerProfile from './components/CustomerProfile'
import CustomerAddress from './components/CustomerAddress'
import AddAddressPage from './pages/AddAddressPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import CustomerOrderPage from './pages/CustomerOrderPage'
import VoucherPage from './pages/VoucherPage'
import OrderDetailPage from './pages/OrderDetailPage'
import TextEditor from './components/TextEditor'
import PolicyPage from './pages/admin/PolicyPage'
import PolicyDetail from './pages/PolicyDetail'
import PolicyDisplayPage from './pages/PolicyDisplayPage'
import { RentedBooksPage } from './pages/RentedBooksPage'
import ProtectedAdminRoutes from './routes/ProtectedAdminRoutes'
import ProtectedCustomerRoutes from './routes/ProtectedCustomerRoutes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AuthorManagementPage from './pages/admin/AuthorManagementPage'
import PublisherManagementPage from './pages/admin/PublisherManagementPage'
import UserEditForm from './pages/admin/UserEditForm'
import AdminProfile from './pages/admin/AdminProfilePage'
import VoucherManagementPage from './pages/admin/VoucherManagementPage'
import ChatBubble from './components/ChatBubble'
import BannerManagementPage from './pages/admin/BannerManagementPage'
import AdminOrderDetail from './pages/admin/AdminOrderDetail'

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
        <LayoutWrapper>
          <Routes>
            <Route path="/login" element={<Login mode={"customer"} />} />
            <Route path='/admin/login' element={<Login mode={"admin"} />} />

            <Route path='/' element={<Home />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path="/store" element={<Browser />} />
            <Route path='/search' element={<Browser />} />
            <Route path='/category/:id' element={<Browser />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/rent' element={<RentPage />} />
            <Route path='/account/*' element={<Account />} />
            <Route path="/terms" element={<PolicyDisplayPage />} />

            <Route path='/admin' element={
              <ProtectedAdminRoutes>
                <AdminLayout />
              </ProtectedAdminRoutes>
            } >
              <Route index element={<AdminDashboard />} />
              <Route path='/admin/orders' element={<AdminOrdersPage />} />
              <Route path='/admin/orders/:id' element={<AdminOrderDetail />} />
              <Route path='/admin/rentals' element={<AdminRentalsPage />} />
              <Route path='/admin/books' element={<AdminBooksPage />} />
              <Route path='/admin/categories' element={<AdminCategoriesPage />} />
              <Route path='/admin/authors' element={<AuthorManagementPage />} />
              <Route path='/admin/publishers' element={<PublisherManagementPage />} />
              <Route path='/admin/users' element={<AdminUsersPage />} />
              <Route path='/admin/users/:id/edit' element={<UserEditForm />} />
              <Route path='/admin/books/add-new-book' element={<AddBookPage />} />
              <Route path='/admin/books/:id/edit' element={<UpdateBookPage book={null} />} />
              <Route path='/admin/policies' element={<PolicyPage />} />
              <Route path='/admin/policies/add' element={<TextEditor />} />
              <Route path='/admin/policy/:id/edit' element={<TextEditor />} />
              <Route path='/admin/policy/:id' element={<PolicyDetail />} />
              <Route path='/admin/profile' element={<AdminProfile />} />
              <Route path='/admin/vouchers' element={<VoucherManagementPage />} />
              <Route path='/admin/banners' element={<BannerManagementPage />} />
            </Route>

            <Route path='/customer' element={
              <ProtectedCustomerRoutes>
                <CustomerLayout />
              </ProtectedCustomerRoutes>
            }>
              <Route path='/customer/account' index element={<CustomerProfile />} />
              <Route path='/customer/address' element={<CustomerAddress />} />
              <Route path='/customer/address/new' element={<AddAddressPage />} />
              <Route path='/customer/address/edit/:id' element={<AddAddressPage />} />
              <Route path='/customer/changepassword' element={<ChangePasswordPage />} />
              <Route path='/customer/orders' element={<CustomerOrderPage />} />
              <Route path='/customer/orders/:id' element={<OrderDetailPage />} />
              <Route path='/customer/rentals' element={<RentedBooksPage />} />
              <Route path='/customer/vouchers' element={<VoucherPage />} />
              <Route path='/customer/wishlist' element={<></>} />
            </Route>

          </Routes>
        </LayoutWrapper>
      </Router>
    </>
  )
}

function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isCheckoutRoute = location.pathname === '/checkout';

  const isHideLayout = isAdminRoute || isCheckoutRoute;

  return (
    <>
      {!isHideLayout && <Header />}
      {children}
      {!isHideLayout && <Footer />}
      {!isHideLayout && <ChatBubble />}
    </>
  );
}


export default App
