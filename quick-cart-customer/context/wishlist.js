import React, { createContext, useState, useContext } from "react";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (product) => {
    if (!wishlist.some((item) => item.id === product.id)) {
      setWishlist((prevWishlist) => [...prevWishlist, product]);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    );
  };

  const isProductInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const values = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
  };

  return (
    <WishlistContext.Provider value={values}>
      {children}
    </WishlistContext.Provider>
  );
};

const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export { WishlistProvider, useWishlist };