import React from "react";
import { Routes, Route } from "react-router-dom";
import * as navbars from "./components/navbars";
import Login from "./pages/Login";

function App() {
  return (
    <div>
      <navbars.Navbar1 />
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
