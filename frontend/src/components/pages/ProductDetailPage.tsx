import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import {
  Product,
  getCartFromDatabase,
  calculateCartCount,
  updateCartItem,
} from "../../utils/cartUtils";
import {
  IndianRupee,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [, setCart] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [messages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productResponse, cartData] = await Promise.all([
          axios.get(`https://cartify-backend-4djv.onrender.com/api/products/${id}`),
          getCartFromDatabase(),
        ]);

        setProduct(productResponse.data);
        setCart(cartData);
        setCartCount(calculateCartCount(cartData));
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
        navigate("/");
      }
    };

    loadData();
  }, [id, navigate]);

  const increaseQuantity = () => {
    if (product && product.quantity > 0) {
      setQuantity((prev) => Math.min(prev + 1, Math.min(50, product.quantity)));
    }
  };

  const decreaseQuantity = () => {
    if (product) {
      setQuantity((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleAddToCart = async () => {
    if (product && quantity > 0) {
      try {
        const updatedCart = await updateCartItem(product, quantity);
        setCart(updatedCart);
        setCartCount(calculateCartCount(updatedCart));
      } catch (error) {
        console.error("Error adding to cart:", error);
        if ((error as Error).message === "User not logged in") {
          navigate("/login");
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        <Navbar cartCount={0} />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        <Navbar cartCount={0} />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="64"
            height="64"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or may have been
            removed.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            Browse Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <Navbar cartCount={cartCount} />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-6">
              <Link
                to="/"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4 group"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain max-h-[400px]"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h1 className="mt-1 text-2xl font-bold text-gray-900">
                      {product.title}
                    </h1>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-base font-medium text-gray-900">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-600">
                        {product.count} reviews
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="h-5 w-5 text-indigo-600" />
                      <span className="text-2xl font-bold text-gray-900">
                        {product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <Truck className="h-4 w-4 text-indigo-600 mr-2" />
                        <span className="text-sm text-gray-700">
                          Free Delivery
                        </span>
                      </div>
                      <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <Shield className="h-4 w-4 text-indigo-600 mr-2" />
                        <span className="text-sm text-gray-700">
                          Secure Payment
                        </span>
                      </div>
                      <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <Package className="h-4 w-4 text-indigo-600 mr-2" />
                        <span className="text-sm text-gray-700">
                          Easy Returns
                        </span>
                      </div>
                      <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <Clock className="h-4 w-4 text-indigo-600 mr-2" />
                        <span className="text-sm text-gray-700">
                          Fast Shipping
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h3 className="text-base font-medium text-gray-900 mb-2">
                        Description
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    <div className="pt-1.5 flex items-center justify-between">
                      <h3 className="text-base font-medium text-gray-900 mb-2">
                        Items Left :
                      </h3>
                      <h4 className="text-sm text-gray-900 leading-relaxed mb-2">
                        {product.quantity} In Stock
                      </h4>
                    </div>

                    <div className="pt-1.5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-medium text-gray-900">
                          Quantity
                        </h3>
                        <div className="flex items-center justify-center border-2 border-gray-200 rounded-lg w-32 shadow-sm">
                          <button
                            onClick={decreaseQuantity}
                            disabled={quantity === 0 || product.quantity === 0}
                            className={`w-12 h-10 text-gray-600 text-2xl font-semibold leading-none rounded-l-lg flex items-center justify-center ${
                              quantity === 0 || product.quantity === 0
                                ? "text-gray-400 cursor-not-allowed"
                                : "hover:bg-gray-50 cursor-pointer"
                            }`}
                          >
                            −
                          </button>
                          <span className="w-16 h-10 flex items-center justify-center border-x border-gray-200 text-center font-medium">
                            {quantity}
                          </span>
                          <button
                            onClick={increaseQuantity}
                            disabled={quantity === 50 || product.quantity === 0}
                            className={`w-12 h-10 text-2xl font-semibold leading-none rounded-r-lg flex items-center justify-center ${
                              quantity === 50 || product.quantity === 0
                                ? "cursor-not-allowed"
                                : "text-gray-600 hover:bg-gray-50 cursor-pointer"
                            }`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {messages[product.id] && (
                        <div
                          className={`p-2 rounded-lg mb-3 ${
                            messages[product.id].includes("success")
                              ? "bg-green-50 text-green-800 border border-green-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <p className="text-sm">{messages[product.id]}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={handleAddToCart}
                        disabled={quantity === 0 || product.quantity === 0}
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.quantity === 0
                          ? "Out of Stock"
                          : quantity > 0
                          ? "Update Cart"
                          : "Add to Cart"}
                      </button>
                    </div>

                    {product.quantity === 0 && (
                      <div className="mt-2 p-2 rounded-lg bg-red-50 text-red-800 border border-red-200">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <p className="text-sm">
                            This product is currently out of stock
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="text-center pt-2">
                      <Link
                        to="/"
                        className="text-indigo-600 hover:text-indigo-500 font-medium inline-flex items-center text-sm"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4 rotate-180" />
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
