import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import BookDetail from "../pages/bookDetail";
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={""} element={<Home />}></Route>
        <Route path={"login/"} element={<Login />}></Route>
        <Route path={"signup/"} element={<Login />}></Route>
        <Route path="bookDetail/:id" element={<BookDetail />} />
        <Route path={"*"} element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
