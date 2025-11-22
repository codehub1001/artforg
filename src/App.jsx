import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";   
import Header from "./components/Header";
import Hero from "./components/Hero";
import GetStarted from "./components/GetStarted";
import FAQ from "./components/Faq";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import About from "./pages/About";
import Explore from "./pages/Explore";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Wrapper component to access location
const AppWrapper = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/userdashboard","/admindashboard"]; // add routes where you don't want header

  return (
    <>
      <Toaster position="top-right" />

      {/* Conditionally render Header */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      <div className="pt-[1px]">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <GetStarted />
                <FAQ />
              </>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);

export default App;
