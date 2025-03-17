import { Routes, Route } from "react-router-dom";
import Layout from "../user/components/Layout";
import LoginPage from "../user/pages/LoginPage";
import RegisterPage from "../user/pages/RegisterPage";
import ProfilePage from "../user/pages/ProfilePage";
import VerifyOTPPage from "../user/pages/verifyOTPPage";
import IndexPage from "../user/pages/IndexPage";
import DonationPage from "../user/pages/DonationPage";
import LandingPage from "../user/pages/LandingPage";

import MyDonationsPage from "../user/pages/MyDonationsPage";
import DonationSinglePage from "../user/pages/DonationSinglePage";
import AboutUsPage from "../user/pages/AboutUsPage";
import ContactUsPage from "../user/pages/ContactUsPage";
import FeedbackPage from "../user/pages/FeedbackPage";
import BooksPage from "../user/pages/BooksPage";
import BookDetailsPage from "../user/pages/BookDetailsPage";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="account" element={<ProfilePage />} />
        <Route path="verify-otp" element={<VerifyOTPPage />} />
        <Route path="donation" element={<DonationPage />} />
        <Route path="landing" element={<LandingPage />} />

        <Route path="account/donations" element={<MyDonationsPage />} />
        <Route path="donations/:donationId" element={<DonationSinglePage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="contact" element={<ContactUsPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:id" element={<BookDetailsPage />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
