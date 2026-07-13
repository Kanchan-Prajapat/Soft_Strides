import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);