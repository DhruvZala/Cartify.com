import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { Package, IndianRupee, Calendar } from "lucide-react";
import { getCartFromDatabase, calculateCartCount } from "../../utils/cartUtils";

interface OrderItem {
  name: string;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  billAmount: number;
  createdAt: string;
}

interface UserInfo {
  name: string;
  email: string;
  userId: string;
}

function UserDetail() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("jwtToken");
      const userName = localStorage.getItem("name");
      const userEmail = localStorage.getItem("email");

      if (!userId || !token) {
        alert("Please login to access this page");
        navigate("/login");
        return;
      }

      setUserInfo({
        name: userName || "User",
        email: userEmail || "",
        userId: userId,
      });

      try {
        // Get cart data from database
        const cartData = await getCartFromDatabase();
        setCartCount(calculateCartCount(cartData));

        // Fetch orders
        const orderResponse = await axios.get(
          `https://cartify-backend-4djv.onrender.com/api/orders/user/${userId}`
        );
        if (orderResponse.data.success) {
          setOrders(orderResponse.data.orders);
        } else {
          setError("Failed to fetch orders");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar cartCount={cartCount} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar cartCount={cartCount} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar cartCount={cartCount} />

      <div className="bg-gradient-to-b from-indigo-600 to-indigo-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {userInfo && (
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  Welcome, {userInfo.name}
                </h1>
                <div className="flex items-center space-x-6 text-indigo-100">
                  <div className="flex items-center">
                    <span className="text-sm">User ID:</span>
                    <span className="ml-2 px-3 py-1 bg-indigo-500 rounded-full text-sm font-mono">
                      {userInfo.userId}
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-sm">Email:</span>
                    <span className="ml-2 font-medium">{userInfo.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Package className="w-6 h-6 mr-3 text-indigo-600" />
                Order History
              </h2>
              <div className="text-sm text-gray-500">
                Total Orders: {orders.length}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400 " />
                <p className="text-xl font-semibold text-gray-600 mb-2">
                  No Orders Yet
                </p>
                <p className="text-gray-500 mb-6">
                  Start shopping to create your first order!
                </p>
                <button
                  onClick={() => navigate("/productpage")}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Browse Products
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-lg border border-gray-200 hover:border-indigo-200 transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 mr-2">
                              #{order.orderId}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-lg">
                            <IndianRupee className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-xl font-bold text-green-600">
                              ₹{order.billAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Order Items
                        </h3>
                        <div className="grid gap-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                  <Package className="w-4 h-4 text-indigo-600" />
                                </div>
                                <span className="font-medium text-gray-800">
                                  {item.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                                  Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserDetail;
