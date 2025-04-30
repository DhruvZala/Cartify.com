/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export interface Product {
  rating: number;
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rate: number;
  count: number;
  quantity: number;
}

export const getCartFromDatabase = async (): Promise<Product[]> => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) return [];

    const response = await axios.get(
      "https://cartify-backend-4djv.onrender.com/api/cart",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data.cart.map((item: any) => ({
      id: item.productId,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }));
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
};

export const calculateCartCount = (cart: Product[]): number => {
  return cart.reduce(
    (acc: number, item: Product) => acc + (item.quantity || 0),
    0
  );
};

export const updateCartItem = async (
  product: Product,
  newQuantity: number
): Promise<Product[]> => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) throw new Error("User not logged in");

    if (newQuantity === 0) {
      // Remove item
      await axios.delete(
        `https://cartify-backend-4djv.onrender.com/api/cart/remove/${product.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      // Add/Update item
      await axios.post(
        "https://cartify-backend-4djv.onrender.com/api/cart/add",
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: newQuantity,
          image: product.image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    // Get updated cart
    const response = await axios.get(
      "https://cartify-backend-4djv.onrender.com/api/cart",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data.cart.map((item: any) => ({
      id: item.productId,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }));
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

export const addProductToCart = async (
  product: Product
): Promise<{ updatedCart: Product[]; message: string }> => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) throw new Error("User not logged in");

    const response = await axios.get(
      "https://cartify-backend-4djv.onrender.com/api/cart",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const existingItem = response.data.cart.find(
      (item: any) => item.productId === product.id
    );

    if (existingItem) {
      if (existingItem.quantity < 5) {
        const updatedCart = await updateCartItem(
          product,
          existingItem.quantity + 1
        );
        return {
          updatedCart,
          message: "",
        };
      } else {
        return {
          updatedCart: response.data.cart.map((item: any) => ({
            id: item.productId,
            title: item.title,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          })),
          message: "Maximum quantity reached for this item.",
        };
      }
    } else {
      const updatedCart = await updateCartItem(product, 1);
      return {
        updatedCart,
        message: "",
      };
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    throw error;
  }
};

export const syncCartWithDatabase = async (cart: Product[]): Promise<void> => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) return; // If no token, user is not logged in

    // For each item in the cart, send to database
    for (const item of cart) {
      await axios.post(
        "https://cartify-backend-4djv.onrender.com/api/cart/add",
        {
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  } catch (error) {
    console.error("Error syncing cart with database:", error);
  }
};

export const loadCartFromDatabase = async (): Promise<Product[]> => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) return []; // If no token, return empty cart

    const response = await axios.get(
      "https://cartify-backend-4djv.onrender.com/api/cart",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data.cart;
  } catch (error) {
    console.error("Error loading cart from database:", error);
    return [];
  }
};
