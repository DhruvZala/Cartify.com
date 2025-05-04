/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import { RazorpayPayment } from "../../utils/RazorpayService";
import { Minus, Plus, Gift, IndianRupee, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Product,
  getCartFromDatabase,
  updateCartItem,
} from "../../utils/cartUtils";

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate("/login");
        return;
      }
      const cartData = await getCartFromDatabase();
      setCart(cartData);
    };

    loadCart();
  }, [navigate]);

  const handleUpdateQuantity = async (product: Product, change: number) => {
    try {
      const newQuantity = product.quantity + change;
      if (newQuantity >= 0 && newQuantity <= 50) {
        const updatedCart = await updateCartItem(product, newQuantity);
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      if ((error as Error).message === "User not logged in") {
        navigate("/login");
      }
    }
  };

  const applyGiftCard = () => {
    const validCodes: Record<string, number> = {
      DHRUV: 10,
      DEV: 5,
      CARTIFYECOMMERCE: 15,
      NEWUSER: 10,
    };

    if (validCodes[giftCardCode]) {
      setDiscount(validCodes[giftCardCode]);
      setDiscountApplied(true);
      setInvalidCode(false);
    } else {
      setInvalidCode(true);
      setDiscount(0);
      setDiscountApplied(false);
    }
  };

  const removeGiftCard = () => {
    setGiftCardCode("");
    setDiscount(0);
    setDiscountApplied(false);
    setInvalidCode(false);
  };

  const subtotal = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const shippingCost = 0.0;
  const discountAmount = (parseFloat(subtotal) * discount) / 100;
  const totalCost = (
    parseFloat(subtotal) +
    shippingCost -
    discountAmount
  ).toFixed(2);

  const handleCheckout = async () => {
    setPaymentError(null);
    console.log(paymentError);
    await RazorpayPayment(
      parseFloat(totalCost),
      "INR",
      async () => {
        try {
          const updateResponse = await axios.post(
            "https://cartify-backend-4djv.onrender.com/api/products/update-quantities",
            {
              items: cart.map((item) => ({
                id: item.id,
                quantity: item.quantity,
              })),
            }
          );

          if (updateResponse.status === 200) {
            const userId = localStorage.getItem("userId");
            const userName = localStorage.getItem("name");

            console.log("User data from localStorage:", { userId, userName });

            const orderData = {
              userId,
              userName,
              items: cart.map((item) => ({
                name: item.title,
                quantity: item.quantity,
              })),
              billAmount: parseFloat(totalCost),
            };

            console.log("Sending order data:", orderData);

            const orderResponse = await axios.post(
              "https://cartify-backend-4djv.onrender.com/api/orders",
              orderData
            );

            if (orderResponse.status === 201) {
              // Clear cart in database after successful payment
              await axios.delete(
                "https://cartify-backend-4djv.onrender.com/api/cart/clear",
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                  },
                }
              );

              alert(
                `Payment successful! Order ID: ${orderResponse.data.order.orderId}`
              );
              setCart([]);
              // setCartCount(0);
              navigate("/");
            } else {
              setPaymentError(
                "Failed to create order. Please contact support."
              );
            }
          } else {
            setPaymentError(
              "Failed to update product quantities. Please contact support."
            );
          }
        } catch (error: any) {
          console.error("Error processing order:", error);
          console.error("Error response:", error.response?.data);
          setPaymentError(
            error.response?.data?.message ||
              "Failed to process order. Please contact support."
          );
        }
      },
      (error: React.SetStateAction<string | null>) => {
        setPaymentError(error);
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center space-x-2">
          <ShoppingCart className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-semibold text-gray-900">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shopping Cart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Items</h2>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                    {cartCount} {cartCount === 1 ? "Item" : "Items"}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex gap-6">
                    <div className="w-28 h-28 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="flex items-center text-lg font-medium text-gray-900">
                            <IndianRupee size={18} className="mr-1" />
                            {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            <IndianRupee size={14} className="inline mr-1" />
                            {item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border rounded-lg bg-white shadow-sm">
                            <button
                              onClick={() => handleUpdateQuantity(item, -1)}
                              className="p-2 hover:bg-gray-50 cursor-pointer"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item, 1)}
                              className="p-2 hover:bg-gray-50 cursor-pointer"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item, -item.quantity)
                          }
                          className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <Link
                  to="/"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cartCount} items)
                  </span>
                  <span className="flex items-center font-medium text-gray-900">
                    <IndianRupee size={16} className="mr-1" />
                    {subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="flex items-center font-medium text-gray-900">
                    <IndianRupee size={16} className="mr-1" />
                    {shippingCost.toFixed(2)}
                  </span>
                </div>

                {/* Gift Card Section */}
                <div className="pt-4 border-t border-gray-100">
                  {discountApplied ? (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Gift className="h-5 w-5 text-green-500 mr-2" />
                          <p className="font-medium text-green-800">
                            {discount}% discount applied
                          </p>
                        </div>
                        <button
                          onClick={removeGiftCard}
                          className="text-sm font-medium text-red-600 hover:text-red-700 ml-3 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-2 flex justify-between text-sm text-green-700">
                        <span>Saving Of</span>
                        <span className="flex items-center font-medium">
                          <IndianRupee size={16} className="mx-1" />
                          {discountAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GIFT CARD OR DISCOUNT CODE
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={giftCardCode}
                          onChange={(e) => setGiftCardCode(e.target.value)}
                          placeholder="Enter your code"
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm"
                        />
                        <button
                          onClick={applyGiftCard}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {invalidCode && (
                        <p className="mt-2 text-sm text-red-600">
                          Invalid gift card code
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="flex items-center text-xl font-semibold text-gray-900">
                      <IndianRupee size={20} className="mr-1" />
                      {totalCost}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 font-medium shadow-sm mt-6 cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
