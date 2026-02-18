import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Categories from "./pages/Categories";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import CustomerOrders from "./pages/CustomerOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerDetails from "./pages/CustomerDetails";
import "./styles/theme.css";
import Reviews from "./pages/Reviews";
import Coupons from "./pages/Coupons";
import Banners from "./pages/Banners";
import CancelledOrders from "./pages/CancelledOrders";
import ReturnedOrders from "./pages/ReturnedOrders";
import RejectedOrders from "./pages/RejectedOrders";
import FlashSales from "./pages/FlashSales";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>
        } />

        <Route path="/products" element={
          <ProtectedRoute><Products /></ProtectedRoute>
        } />

        <Route path="/customers" element={
          <ProtectedRoute><Customers /></ProtectedRoute>
        } />

        <Route path="/customers/:id" element={
          <ProtectedRoute><CustomerDetails /></ProtectedRoute>
        } />

        <Route path="/customers/:id/orders" element={
          <ProtectedRoute><CustomerOrders /></ProtectedRoute>
        } />

        <Route path="/categories" element={
          <ProtectedRoute><Categories /></ProtectedRoute>
        } />

        <Route path="/payments" element={
          <ProtectedRoute><Payments /></ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute><Settings /></ProtectedRoute>
        } />

        <Route path="/reviews" element={
          <ProtectedRoute><Reviews /></ProtectedRoute>
        } />

        <Route path="/banners" element={
          <ProtectedRoute><Banners /></ProtectedRoute>
        } />

        <Route path="/coupons" element={
          <ProtectedRoute><Coupons /></ProtectedRoute>
        } />

        <Route path="/cancelled" element={
          <ProtectedRoute><CancelledOrders /> </ProtectedRoute>} />

        <Route path="/returned" element={
          <ProtectedRoute> <ReturnedOrders /></ProtectedRoute>} />

        <Route path="/rejected" element={
          <ProtectedRoute><RejectedOrders /></ProtectedRoute>
        } />

        <Route path="/flash-sales" element={
          <ProtectedRoute> <FlashSales /> </ProtectedRoute>} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;