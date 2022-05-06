import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const request = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      try {
        // if (body) {
        //   body = JSON.stringify(body);
        // headers["Content-Type"] = "application/json";
        // }
        const response = await fetch(url, { method, body, headers });
        const data = await response.json();

        if (response.status === 401) {
          auth.logout();
          navigate("/");
        }

        if (!response.ok) {
          throw new Error(data.message || "Что-то пошло не так");
        }

        setLoading(false);
        setData(data);
        return data;
      } catch (e) {
        setLoading(false);
        setError(e.message);
        throw e;
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);
  return { loading, request, error, clearError, data };
};
