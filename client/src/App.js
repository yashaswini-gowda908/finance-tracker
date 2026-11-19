import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup    from "./Signup";
import Login     from "./Login";
import Dashboard from "./Dashboard";

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Signup />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
