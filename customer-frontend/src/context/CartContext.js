import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("softstrides-cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "softstrides-cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);

  /* ==============================
     ADD TO CART (SIZE SUPPORTED)
  ============================== */
  const addToCart = (product) => {
    if (!product.size) {
      alert("Size is required");
      return;
    }

    setCartItems((prev) => {
      // 🔥 check BOTH id + size
      const exists = prev.find(
        (item) =>
          item._id === product._id &&
          item.size === product.size
      );

      if (exists) {
        return prev.map((item) =>
          item._id === product._id &&
          item.size === product.size
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  /* ==============================
     INCREASE QTY (ID + SIZE)
  ============================== */
  const increaseQty = (id, size) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id && item.size === size
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  /* ==============================
     DECREASE QTY (ID + SIZE)
  ============================== */
  const decreaseQty = (id, size) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id && item.size === size
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  /* ==============================
     REMOVE ITEM (ID + SIZE)
  ============================== */
  const removeItem = (id, size) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item._id === id && item.size === size)
      )
    );
  };

  /* ==============================
     TOTAL PRICE
  ============================== */
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);