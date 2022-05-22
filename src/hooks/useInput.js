import { useState, useCallback, useMemo } from "react";
import { useHttp } from "./http.hook";
import { useAuth } from "./auth.hook";
import { fetchProducts } from "../redux/actions/products";
import { useDispatch } from "react-redux";

function debounce(fn, timeout = 500) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(fn, timeout, ...args);
  };
}

function useDebounce(fn) {
  const debounced = useMemo(() => debounce(fn), [fn]);
  return debounced;
}

export default function useInput(initialValue, id, field, itemCtx) {
  const dispatch = useDispatch();
  const { request, loading } = useHttp();
  const { token } = useAuth();
  const [value, setValue] = useState(initialValue);

  const deleteItem = useCallback(
    async (itemCtx) => {
      await request("/api/" + itemCtx + "/" + id, "DELETE", null, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });
      if (!loading) {
        dispatch(fetchProducts());
      }
    },
    [id, request, token, dispatch, loading]
  );

  const saveValue = useCallback(
    async (value, itemCtx) => {
      await request(
        "/api/" + itemCtx + "/edit",
        "PUT",
        JSON.stringify({ id: id, field, value }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      if (!loading) {
        dispatch(fetchProducts());
      }
    },
    [id, field, request, token, dispatch, loading]
  );

  const handleChange = useDebounce(saveValue);

  const onChange = (value) => {
    setValue(value);
    handleChange(value, itemCtx);
  };
  const clear = () => {
    setValue("");
  };

  const onDelete = () => {
    deleteItem(itemCtx);
  };
  return {
    props: { value, onChange, onDelete },
    value,
    clear,
    loading,
  };
}
