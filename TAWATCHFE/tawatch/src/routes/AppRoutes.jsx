import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home/Home.jsx'

const Login           = lazy(() => import('../pages/Login/Login.jsx'))
const Register        = lazy(() => import('../pages/Register/Register.jsx'))
const ForgotPassword  = lazy(() => import('../pages/Auth/ForgotPassword.jsx'))
const VerifyOtp       = lazy(() => import('../pages/Auth/VerifyOtp.jsx'))
const ResetPassword   = lazy(() => import('../pages/Auth/ResetPassword.jsx'))
const ProductList     = lazy(() => import('../pages/Product/ProductList.jsx'))
const ProductDetail   = lazy(() => import('../pages/Product/ProductDetail.jsx'))
const Cart            = lazy(() => import('../pages/Cart/Cart.jsx'))
const Checkout        = lazy(() => import('../pages/Checkout/Checkout.jsx'))
const OrderHistory    = lazy(() => import('../pages/Order/OrderHistory.jsx'))
const Profile         = lazy(() => import('../pages/Profile/Profile.jsx'))
const Brands          = lazy(() => import('../pages/Brands/Brands.jsx'))
const Contact         = lazy(() => import('../pages/Contact/Contact.jsx'))
const VNPayReturn     = lazy(() => import('../pages/Payment/VNPayReturn.jsx'))
const Wishlist        = lazy(() => import('../pages/Wishlist/Wishlist.jsx'))

const AdminLayout     = lazy(() => import('../layouts/AdminLayout.jsx'))
const Dashboard       = lazy(() => import('../pages/Admin/Dashboard.jsx'))
const ManageProduct   = lazy(() => import('../pages/Admin/ManageProduct.jsx'))
const ManageBrand     = lazy(() => import('../pages/Admin/ManageBrand.jsx'))
const ManageOrder     = lazy(() => import('../pages/Admin/ManageOrder.jsx'))
const ManageCategory  = lazy(() => import('../pages/Admin/ManageCategory.jsx'))
const ManageSegment   = lazy(() => import('../pages/Admin/ManageSegment.jsx'))
const ManageCustomer  = lazy(() => import('../pages/Admin/ManageCustomer.jsx'))
const ManageColor     = lazy(() => import('../pages/Admin/ManageColor.jsx'))
const ManagePromotion = lazy(() => import('../pages/Admin/ManagePromotion.jsx'))
const ManageReview    = lazy(() => import('../pages/Admin/ManageReview.jsx'))
const ManageSettings  = lazy(() => import('../pages/Admin/ManageSettings.jsx'))

import AdminRoute from './AdminRoute.jsx'

function PageLoader() {
  return <div className="min-h-screen bg-background" />
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/vnpay-return" element={<VNPayReturn />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<ManageProduct />} />
            <Route path="segments" element={<ManageSegment />} />
            <Route path="categories" element={<ManageCategory />} />
            <Route path="brands" element={<ManageBrand />} />
            <Route path="customers" element={<ManageCustomer />} />
            <Route path="orders" element={<ManageOrder />} />
            <Route path="colors" element={<ManageColor />} />
            <Route path="promotions" element={<ManagePromotion />} />
            <Route path="reviews" element={<ManageReview />} />
            <Route path="settings" element={<ManageSettings />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
