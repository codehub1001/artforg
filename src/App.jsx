import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <div className="pt-[80px]">
        <Routes>
          <Route path="/" element={<Hero />} />
          {/* Add more routes here */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
