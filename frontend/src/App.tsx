import Login from "./components/auth/Login";
import ProductPage from "./components/pages/ProductPage";
import "./index.css";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import AdminDashboard from "./components/auth/AdminDashboard";
import Cart from "./components/pages/Cart";
import ProductDetailPage from "./components/pages/ProductDetailPage";
import Register from "./components/auth/Register";
import ChangePassword from "./components/auth/ChangePassword";
import UserDetail from "./components/pages/UserDetail";

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
    <AppRoutes />
  </Router>
);

export default Root;
