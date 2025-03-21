import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion"; // Import Framer Motion
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
import MyTicketsPage from "../user/pages/MyTicketsPage";
import TicketSinglePage from "../user/pages/TicketSinglePage";

const pageVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -100, transition: { duration: 0.3, ease: "easeIn" } },
};

const UserRoutes = () => {
  const location = useLocation(); // Get the current location

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <IndexPage />
              </motion.div>
            }
          />
          <Route
            path="login"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <LoginPage />
              </motion.div>
            }
          />
          <Route
            path="register"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <RegisterPage />
              </motion.div>
            }
          />
          <Route
            path="account"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ProfilePage />
              </motion.div>
            }
          />
          <Route
            path="verify-otp"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <VerifyOTPPage />
              </motion.div>
            }
          />
          <Route
            path="donation"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <DonationPage />
              </motion.div>
            }
          />
          <Route
            path="landing"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <LandingPage />
              </motion.div>
            }
          />
          <Route
            path="account/donations"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <MyDonationsPage />
              </motion.div>
            }
          />
          <Route
            path="donations/:donationId"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <DonationSinglePage />
              </motion.div>
            }
          />
          <Route
            path="about"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <AboutUsPage />
              </motion.div>
            }
          />
          <Route
            path="contact"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ContactUsPage />
              </motion.div>
            }
          />
          <Route
            path="feedback"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <FeedbackPage />
              </motion.div>
            }
          />
          <Route
            path="books"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <BooksPage />
              </motion.div>
            }
          />
          <Route
            path="books/:id"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <BookDetailsPage />
              </motion.div>
            }
          />
          <Route
            path="contact/your-tickets"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <MyTicketsPage />
              </motion.div>
            }
          />
          <Route
            path="contacts/:contactId"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <TicketSinglePage />
              </motion.div>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default UserRoutes;
