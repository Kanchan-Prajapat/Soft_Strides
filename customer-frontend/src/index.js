import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
    <CartProvider>
      <WishlistProvider>
       <AuthProvider>
        <App />
         </AuthProvider>
      </WishlistProvider>
    </CartProvider>
 
);
