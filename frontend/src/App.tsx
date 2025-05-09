import { lazy, Suspense } from "react";
import "./index.css";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";

// Lazy load components
const Login = lazy(() => import("./components/auth/Login"));
const ProductPage = lazy(() => import("./components/pages/ProductPage"));
const AdminDashboard = lazy(() => import("./components/auth/AdminDashboard"));
const Cart = lazy(() => import("./components/pages/Cart"));
const ProductDetailPage = lazy(() => import("./components/pages/ProductDetailPage"));
const Register = lazy(() => import("./components/auth/Register"));
const ChangePassword = lazy(() => import("./components/auth/ChangePassword"));
const UserDetail = lazy(() => import("./components/pages/UserDetail"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const AppRoutes: React.FC = () => {
  const routes = [
    { path: "/login", element: <Login /> },
    { path: "/", element: <ProductPage /> },
    { path: "/productPage", element: <ProductPage /> },
    { path: "/cart", element: <Cart /> },
    { path: "/product/:id", element: <ProductDetailPage /> },
    { path: "/registerPage", element: <Register /> },
    { path: "/changePassword", element: <ChangePassword /> },
    { path: "/admin", element: <AdminDashboard /> },
    { path: "/userDetail", element: <UserDetail/> }
  ];

  return useRoutes(routes);
};

const Root: React.FC = () => (
  <Router>
    <Suspense fallback={<LoadingSpinner />}>
      <AppRoutes />
    </Suspense>
  </Router>
);

export default Root;
