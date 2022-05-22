import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AuthPage } from "./pages/AuthPage";
import { AddProduct } from "./pages/AddProduct";
import { AddVariant } from "./pages/AddVariant";
import { AddCategory } from "./pages/AddCategory";

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/addproduct" exact element={<AddProduct />} />
        <Route path="/addvariant" exact element={<AddVariant />} />
        <Route path="/addcategory" exact element={<AddCategory />} />
        <Route path="*" element={<Navigate to="/addcategory" />} />
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
