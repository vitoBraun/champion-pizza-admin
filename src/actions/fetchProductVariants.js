export const fetchProductVariants = async (token, request, selectedProduct) => {
  try {
    return await request(
      "/api/productvariant/" + selectedProduct,
      "GET",
      null,
      { Authorization: `Bearer ${token}` }
    );
  } catch (error) {
    console.log(error);
  }
};
