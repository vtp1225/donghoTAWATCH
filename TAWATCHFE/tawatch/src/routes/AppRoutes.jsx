import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home.jsx'
import Login from '../pages/Login/Login.jsx'
import Register from '../pages/Register/Register.jsx'
import ForgotPassword from '../pages/Auth/ForgotPassword.jsx'
import VerifyOtp from '../pages/Auth/VerifyOtp.jsx'
import ResetPassword from '../pages/Auth/ResetPassword.jsx'
import ProductList from '../pages/Product/ProductList.jsx'
import ProductDetail from '../pages/Product/ProductDetail.jsx'
import Cart from '../pages/Cart/Cart.jsx'
import Checkout from '../pages/Checkout/Checkout.jsx'
import OrderHistory from '../pages/Order/OrderHistory.jsx'
import Brands from '../pages/Brands/Brands.jsx'
import Contact from '../pages/Contact/Contact.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import AdminRoute from './AdminRoute.jsx'
import Dashboard from '../pages/Admin/Dashboard.jsx'
import ManageProduct from '../pages/Admin/ManageProduct.jsx'
import ManageBrand from '../pages/Admin/ManageBrand.jsx'
import ManageOrder from '../pages/Admin/ManageOrder.jsx'
import ManageCategory from '../pages/Admin/ManageCategory.jsx'
import ManageSegment from '../pages/Admin/ManageSegment.jsx'
import ManageCustomer from '../pages/Admin/ManageCustomer.jsx'

export default function AppRoutes() {
  return (
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
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/brands" element={<Brands />} />
      <Route path="/lien-he" element={<Contact />} />

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<ManageProduct />} />
          <Route path="segments" element={<ManageSegment />} />
          <Route path="categories" element={<ManageCategory />} />
          <Route path="brands" element={<ManageBrand />} />
          <Route path="customers" element={<ManageCustomer />} />
          <Route path="orders" element={<ManageOrder />} />
        </Route>
      </Route>
    </Routes>
  )
}
