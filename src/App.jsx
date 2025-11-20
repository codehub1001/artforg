import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import GetStarted from "./components/GetStarted";
import FAQ from "./components/Faq";

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
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
