import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { Link, useNavigate } from "react-router-dom";
import {
  Product,
  getCartFromDatabase,
  calculateCartCount,
  addProductToCart,
} from "../../utils/cartUtils";
import {
  IndianRupee,
  ShoppingCart,
  Star,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cartCount, setCartCount] = useState<number>(0);
  const [cart, setCart] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const productsPerPage = 12;

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("jwtToken");
      setIsLoggedIn(!!token);

      try {
        // Fetch products
        const response = await axios.get(`http://localhost:5000/api/products?page=${currentPage}&limit=${productsPerPage}`);
        if (response.data && response.data.products) {
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages);
        }

        // Fetch cart if logged in
        if (token) {
          const cartData = await getCartFromDatabase();
          setCart(cartData);
          setCartCount(calculateCartCount(cartData));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleProductClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("Please login or register to view product details.");
      navigate("/login");
    }
  };

  const currentProducts = products;

  const updateQuantity = (productId: number, change: number) => {
    if (!isLoggedIn) {
      alert("Please login to modify your cart.");
      navigate("/login");
      return;
    }

    const updatedCart = cart
      .map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          if (newQuantity >= 0 && newQuantity <= 50) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    setCartCount(calculateCartCount(updatedCart));
  };

  const handleAddToCart = async (product: Product) => {
    if (!isLoggedIn) {
      alert("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      const { updatedCart, message } = await addProductToCart(product);
      setCart(updatedCart);
      setCartCount(calculateCartCount(updatedCart));
      if (message) {
        alert(message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      if ((error as Error).message === 'User not logged in') {
        navigate("/login");
      }
    }
  };

  const isInCart = (productId: number) => {
    return cart.some((item) => item.id === productId);
  };

  const getQuantity = (productId: number) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="sticky top-0 z-50 shadow-md bg-white/80 backdrop-blur-sm">
        <Navbar cartCount={cartCount} />
      </div>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {!isLoggedIn && (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 shadow-sm">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <p className="text-yellow-800">
                    Please{" "}
                    <Link
                      to="/login"
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      login
                    </Link>{" "}
                    to view product details and add items to your cart.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full border border-gray-100"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-grow flex flex-col"
                    onClick={handleProductClick}
                  >
                    <div className="p-6 flex justify-center items-center border-b-1 border-gray-300 h-64">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full object-contain"
                      />
                    </div>
                    <div className="px-6 py-4 flex-grow">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-700">
                          {product.rating}
                        </span>
                        <span className="mx-1 text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                          {product.count} reviews
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900 flex items-center">
                        <IndianRupee className="h-4 w-4 text-gray-700" />
                        {product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>

                  <div className="px-6 pb-6">
                    {!isInCart(product.id) ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!isLoggedIn || product.quantity === 0}
                        className={`inline-flex cursor-pointer py-2 px-8 rounded-lg font-medium transition-all duration-200 items-center justify-center space-x-2 ${
                          isLoggedIn && product.quantity > 0
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white border border-transparent"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        }`}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="text-sm">
                          {!isLoggedIn 
                            ? "Login to Add" 
                            : product.quantity === 0 
                              ? "Out of Stock" 
                              : "Add to Cart"}
                        </span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        {getQuantity(product.id) === 50 && (
                          <p className="text-sm text-red-600 text-center font-medium">
                            Maximum quantity reached
                          </p>
                        )}
                        <div className="inline-flex items-center border border-gray-300 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="w-10 h-9 cursor-pointer text-gray-600 hover:bg-gray-50 rounded-l-lg transition-colors flex items-center justify-center text-base font-medium leading-none"
                          >
                            −
                          </button>
                          <span className="w-12 h-9 flex items-center justify-center text-sm font-medium border-x border-gray-300 text-gray-900">
                            {getQuantity(product.id)}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            disabled={
                              getQuantity(product.id) === 50 || !isLoggedIn
                            }
                            className={`w-10 h-9 cursor-pointer rounded-r-lg transition-colors flex items-center justify-center text-base font-medium leading-none ${
                              getQuantity(product.id) === 50 || !isLoggedIn
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 text-sm rounded-lg font-medium ${
                        currentPage === index + 1
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
