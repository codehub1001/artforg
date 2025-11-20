import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import GetStarted from "./components/GetStarted";
import FAQ from "./components/Faq";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import About from "./pages/About";
import Explore from "./pages/Explore";

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <div className="pt-[70px]">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <GetStarted />
                <FAQ/>
              </>
            }
          />
          {/* Add more routes here */}
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signin" element={<SignIn/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/explore" element={<Explore/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
