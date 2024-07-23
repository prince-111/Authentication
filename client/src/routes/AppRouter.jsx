import { Routes, Route, } from "react-router-dom";
import Home from "../pages/Home";
import ContactUs from "../pages/ContactUs";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Services from "../pages/Services";
import Feed from "../pages/Feed";

const AppRouter = () => {
  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/services" element ={<Services />} />
          <Route path="/feed" element={<Feed />} />{}
        </Routes>
    </>
  );
};

export default AppRouter;
