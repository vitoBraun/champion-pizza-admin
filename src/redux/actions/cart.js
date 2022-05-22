import axios from "axios";

export const placeNewOrder = async (orderObj, customer) => {
  await axios
    .post("/api/order/neworder", {
      orderObj: orderObj,
      customer: customer,
    })
    .then((data) => {
      console.log(data);
      // setOrderPlaced(true);
    });
  // .catch((err) => {
  //   if (err.response.status !== 200) {
  //     setOrderPlaced(false);
  //   }
  // });
};

export const addProductToCart = (obj) => ({
  type: "ADD_PRODUCT_CART",
  payload: obj,
});

export const clearCart = () => ({
  type: "CLEAR_CART",
});

export const removeCartItem = (variantId, dough = null) => ({
  type: "REMOVE_CART_ITEM",
  payload: variantId,
  payloadDough: dough,
});

export const plusCartItem = (variantId, dough = null) => ({
  type: "PLUS_CART_ITEM",
  payload: variantId,
  payloadDough: dough,
});

export const minusCartItem = (variantId, dough = null) => ({
  type: "MINUS_CART_ITEM",
  payload: variantId,
  payloadDough: dough,
});
