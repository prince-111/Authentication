import {  BrowserRouter as Routes, Router, Route, } from "react-router-dom";
import Home from "../pages/Home";
import ContactUs from "../pages/ContactUs";
import Register from "../pages/Register";
import Login from "../pages/Login";

const AppRouter = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contactUs" element={<ContactUs />} />
        </Routes>
      </Router>
    </>
  );
};

export default AppRouter;
