import React, { useEffect, useState, useContext, useCallback } from "react";

import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { fetchProducts } from "../redux/actions/products";
import { useDispatch } from "react-redux";
import { Card, Form } from "react-bootstrap";
import CategoryList from "../components/CategoryList/CategoryList";

import SubmitButton from "../components/SubmitButton";
import AlertBlock from "../components/AlertBlock";

export const AddCategory = () => {
  const { request, error, loading, clearError } = useHttp();
  const dispatch = useDispatch();
  const [categoryName, setСategoryName] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [noticeError, setNoticeError] = useState(false);
  const [notice, setNotice] = useState(false);

  const { token } = useContext(AuthContext);

  const CheckAllErrors = useCallback(async () => {
    if (categoryName !== "") {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [categoryName]);

  const submitHandler = async () => {
    try {
      await request(
        "/api/category/add",
        "POST",
        JSON.stringify({ categoryName: categoryName }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      if (!error && !loading) {
        dispatch(fetchProducts());
        setСategoryName("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    CheckAllErrors();
  }, [CheckAllErrors]);

  useEffect(() => {
    setNoticeError(error);
  }, [error]);

  return (
    <>
      <AlertBlock noticeError={noticeError} notice={notice} />
      <Card.Header>
        <h3>Добавление Категории</h3>
      </Card.Header>
      <Card.Body
        onClick={() => {
          clearError();
          setNotice(null);
        }}
      >
        <blockquote className="blockquote mb-0">
          <Form.Group className="mb-3" controlId="addproduct">
            <Form.Label>Название категории</Form.Label>
            <Form.Control
              type="name"
              placeholder="Введите название категории"
              onChange={(e) => setСategoryName(e.target.value)}
              value={categoryName}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="addproduct">
            <SubmitButton
              submitFunc={submitHandler}
              buttonText="Добавить категорию"
              buttonDisabled={buttonDisabled}
            />
          </Form.Group>
        </blockquote>
      </Card.Body>
      <CategoryList />
    </>
  );
};
