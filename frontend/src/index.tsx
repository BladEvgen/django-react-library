import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./css/bootstrap/bootstrap.css";
import "./css/fontawesome/css/all.css";
import "./index.css";
import axios from "axios";
import Router from "./components/router";
import { Interface } from "readline";

function App() {
  return null;
}
export default App;
createRoot(document.getElementById("root")!).render(<Router />);
