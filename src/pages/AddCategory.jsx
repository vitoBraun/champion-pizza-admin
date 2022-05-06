import React, { useState, useEffect, useContext, useCallback } from "react";
// import Select from 'react-select';
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
// import {useNavigate} from 'react-router-dom'
import { Card, Form } from "react-bootstrap";
import ItemsList from "../components/ItemsList";
import { fetchCategories } from "../actions/fetchCategories";
import SubmitButton from "../components/SubmitButton";
import AlertBlock from "../components/AlertBlock";

export const AddCategory = () => {
  const auth = useContext(AuthContext);
  const { request, error, loading, clearError } = useHttp();
  const [categoryName, setСategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [noticeError, setNoticeError] = useState(false);
  const [notice, setNotice] = useState(false);

  const { token } = useContext(AuthContext);

  const Categories = useCallback(async () => {
    setCategories(await fetchCategories(token, request));
  }, [token, request]);

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
        Categories();
        setСategoryName("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const categoryDelete = async (categoryId) => {
    try {
      await request("/api/category/" + categoryId, "DELETE", null, {
        Authorization: `Bearer ${auth.token}`,
      });
      Categories();
      // console.log(categoryId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Categories();
  }, [Categories]);

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
            {/* <Form.Label>Название категории</Form.Label> */}
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

      {categories.length > 0 && (
        <ItemsList
          items={categories}
          itemName="categoryName"
          delFunc={categoryDelete}
        />
      )}
    </>
  );
};
