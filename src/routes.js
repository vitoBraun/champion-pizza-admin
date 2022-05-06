import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// import {LinksPage} from './pages/LinksPage';
// import {CreatePage} from './pages/CreatePage';
// import {DetailPage} from './pages/DetailPage';
import { AuthPage } from "./pages/AuthPage";
import { AddProduct } from "./pages/AddProduct";
// import {Dashboard} from './pages/Dashboard';
import { AddVariant } from "./pages/AddVariant";
import { AddCategory } from "./pages/AddCategory";

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Routes>
        {/* <Route path="/links" exact element={<LinksPage />} /> */}
        {/* <Route path="/dashboard" exact element={<Dashboard />} /> */}
        <Route path="/addproduct" exact element={<AddProduct />} />
        <Route path="/addvariant" exact element={<AddVariant />} />
        <Route path="/addcategory" exact element={<AddCategory />} />
        {/* <Route path="/detail/:id" element={<DetailPage />} /> */}
        <Route path="*" element={<Navigate to="/addproduct" />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
