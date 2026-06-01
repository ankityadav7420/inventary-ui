import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import VerifyOtp from "../pages/auth/VerifyOtp";
import Dashboard from "../pages/dashboard/Dashboard";

import ProtectedRoute from "../components/common/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";


import ProductList from "../pages/products/ProductList";
import ProductCreate from "../pages/products/ProductCreate";
import ProductEdit from "../pages/products/ProductEdit";
import ProductDetails from "../pages/products/ProductDetails";


import CustomerList from "../pages/customers/CustomerList";
import CustomerCreate from "../pages/customers/CustomerCreate";
import CustomerDetails from "../pages/customers/CustomerDetails";


import OrderList from "../pages/orders/OrderList";
import CreateOrder from "../pages/orders/CreateOrder";
import OrderDetails from "../pages/orders/OrderDetails";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/verify-otp"
        element={<VerifyOtp />}
      />

      <Route
        path="/"
        element={<Navigate to="/dashboard" />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
  path="/products"
  element={
    <ProtectedRoute>
      <MainLayout>
        <ProductList />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/products/create"
  element={
    <ProtectedRoute>
      <MainLayout>
        <ProductCreate />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/products/:id"
  element={
    <ProtectedRoute>
      <MainLayout>
        <ProductDetails />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/products/edit/:id"
  element={
    <ProtectedRoute>
      <MainLayout>
        <ProductEdit />
      </MainLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/customers"
  element={
    <ProtectedRoute>
      <MainLayout>
        <CustomerList />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/customers/create"
  element={
    <ProtectedRoute>
      <MainLayout>
        <CustomerCreate />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/customers/:id"
  element={
    <ProtectedRoute>
      <MainLayout>
        <CustomerDetails />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/orders"
  element={
    <ProtectedRoute>
      <MainLayout>
        <OrderList />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/orders/create"
  element={
    <ProtectedRoute>
      <MainLayout>
        <CreateOrder />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/orders/:id"
  element={
    <ProtectedRoute>
      <MainLayout>
        <OrderDetails />
      </MainLayout>
    </ProtectedRoute>
  }
/>


      <Route
        path="*"
        element={<h1>Page Not Found</h1>}
      />
    </Routes>
  );
}

export default AppRoutes;