
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

const getProductKey = (item) => item.id;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add product or increase its quantity
  const addToCart = (item) => {
    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (product) => getProductKey(product) === getProductKey(item)
      );

      if (existingItem) {
        return previousItems.map((product) =>
          getProductKey(product) === getProductKey(item)
            ? { ...product, quantity: (product.quantity || 1) + 1 }
            : product
        );
      }

      return [...previousItems, { ...item, quantity: 1 }];
    });
  };

  // Remove a product completely
  const removeFromCart = (item) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (product) => getProductKey(product) !== getProductKey(item)
      )
    );
  };

  // Increase or decrease quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Empty the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Total number of products
  const totalItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
