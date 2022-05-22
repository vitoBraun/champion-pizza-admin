import { useState, useCallback, useEffect } from "react";
import { useHttp } from "./http.hook";
// import { useAuth } from "./auth.hook";
// import { ProductsContext } from "../context/ProductsContext";

// function getCategories(data) {
//   return data.map((category) => ({
//     categoryName: category.categoryName,
//     _id: category._id,
//     visible: category.visible,
//   }));
// }

// function getProducts(data, selectedCategory) {
//   return data.filter(
//     (category) =>
//       category.categoryName === selectedCategory && category.products
//   );
// }

export default function useFetch() {
  const { loading, request } = useHttp();
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetch = useCallback(async () => {
    try {
      const fetched = await request("/api/products/");
      if (!loading) {
        setFetchedProducts(fetched);
      }
    } catch (e) {}
  }, []);

  const getCategories = useCallback(() => {
    const resp = fetchedProducts.map((category) => ({
      categoryName: category.categoryName,
      _id: category._id,
      visible: category.visible,
    }));

    setCategories(resp);
  }, [fetchedProducts]);

  useEffect(() => {
    fetch();
    getCategories();
  }, [fetch]);

  return { fetchedProducts, categories, fetch };
}
