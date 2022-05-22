import axios from "axios";

export const fetchProducts = () => async (dispatch) => {
  await axios.get("/api/products").then(({ data }) => {
    dispatch(setProducts(data));
  });
};

export const addCategory = (categoryName) => {};

export const setProducts = (items) => ({
  type: "SET_PRODUCTS",
  payload: items,
});
