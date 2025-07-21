// src/router.tsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RootLayout from "./components/layout/RootLayout";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ProducerPage from "./pages/ProducerPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import AddRecipePage from "./pages/AddRecipePage";
import SellerPage from "./pages/SellerPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/producer/:id" element={<ProducerPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/recipe/new" element={<AddRecipePage />} />
      <Route path="/sellers/:sellerId" element={<SellerPage />} />
    </Route>
  )
);

export default router;
