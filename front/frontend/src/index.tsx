import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./css/bootstrap/bootstrap.css";
import "./css/fontawesome/css/all.css";
import "./index.css";
import Router from "./components/router";

function App() {
  return (
    <Provider store={store}>
      {" "}
      <Router />
    </Provider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
