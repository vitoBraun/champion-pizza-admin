import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import VariantList from "../components/VariantList/VariantList";
import SubmitButton from "../components/SubmitButton";
import { Form, Card } from "react-bootstrap";
import AlertBlock from "../components/AlertBlock";
import { fetchProducts } from "../redux/actions/products";
import { useDispatch, useSelector } from "react-redux";

export const AddVariant = () => {
  const { request, error, loading, clearError } = useHttp();
  const { token } = useContext(AuthContext);

  const isLoaded = useSelector(({ products }) => products.isLoaded);
  const items = useSelector(({ products }) => products.items);

  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory")
      ? localStorage.getItem("selectedCategory")
      : ""
  );

  const [selectedProduct, setSelectedProduct] = useState("");

  const [variantName, setVariantName] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [productId, setProductId] = useState("");

  const [noticeError, setNoticeError] = useState(false);
  const [notice, setNotice] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const saveSelectedCategory = useCallback((categoryName) => {
    setSelectedCategory(categoryName);
    localStorage.setItem("selectedCategory", categoryName);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setSelectedCategory(
        localStorage.getItem("selectedCategory")
          ? localStorage.getItem("selectedCategory")
          : items[0].categoryName
      );
      setProductId(
        items.filter(
          (category) => category.categoryName === selectedCategory
        )[0]?.products[0]?._id
      );
    }
  }, [isLoaded, items]);

  useEffect(() => {
    setSelectedProduct(
      items.filter((category) => category.categoryName === selectedCategory)[0]
        ?.products[0]?.name
    );
  }, [selectedCategory]);

  useEffect(() => {
    setProductId(
      items.filter((category) => category.categoryName === selectedCategory)[0]
        ?.products[0]._id
    );
    setSelectedProduct(
      items.filter((category) => category.categoryName === selectedCategory)[0]
        ?.products[0]?.name
    );
  }, []);

  // useEffect(() => {
  //   setProductId(
  //     items
  //       .filter((category) => category.categoryName === selectedCategory)[0]
  //       ?.products.filter((product) => product.name === selectedProduct)[0]?._id
  //   );
  // }, [selectedProduct]);

  console.log(productId, selectedProduct);

  const CheckAllErrors = useCallback(async () => {
    if (variantName !== "" && price !== "") {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [variantName, price]);

  useEffect(() => {
    CheckAllErrors();
  }, [CheckAllErrors]);

  useEffect(() => {
    setNoticeError(error);
  }, [error]);

  const submitVariant = async () => {
    try {
      await request(
        "/api/variant/add",
        "POST",
        JSON.stringify({
          variantName: variantName,
          price: price,
          weight: weight,
          categoryName: selectedCategory,
          productName: selectedProduct,
          productId: productId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );
      if (!error && !loading) {
        dispatch(fetchProducts());
        setNotice("Вариант добавлен");
        setVariantName("");
        setPrice("");
        setWeight("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AlertBlock noticeError={noticeError} notice={notice} />
      <Card.Header>
        <h3>Добавление варианта продукта</h3>
      </Card.Header>
      <Card.Body
        onClick={() => {
          clearError();
          setNotice(null);
        }}
      >
        <Form>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Категория</Form.Label>
            <Form.Select
              onChange={(event) => {
                saveSelectedCategory(event.target.value);
              }}
              value={selectedCategory}
            >
              {items.map((category) => (
                <option key={category._id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Продукт</Form.Label>
            <Form.Select
              onChange={(event) => {
                setSelectedProduct(event.target.value);

                const prodId = items
                  .filter(
                    (category) => category?.categoryName === selectedCategory
                  )[0]
                  ?.products.filter(
                    (product) => product?.name === event.target.value
                  )[0]?._id;
                setProductId(prodId);
              }}
              value={selectedProduct}
            >
              {items.map(
                (category) =>
                  category?.categoryName === selectedCategory &&
                  category?.products.map((product) => (
                    <option key={product._id} value={product.name}>
                      {product.name}
                    </option>
                  ))
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="addproduct">
            <Form.Label>Название варианта</Form.Label>
            <Form.Control
              type="name"
              placeholder="Введите название варианта"
              value={variantName}
              onChange={(e) => {
                setVariantName(e.target.value);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Цена</Form.Label>
            <Form.Control
              type="name"
              placeholder="Цена, только цифры"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Вес</Form.Label>
            <Form.Control
              type="name"
              value={weight}
              placeholder="Вес, только цифры"
              onChange={(e) => setWeight(e.target.value)}
            />
          </Form.Group>

          <SubmitButton
            submitFunc={submitVariant}
            buttonText="Добавить вариант"
            buttonDisabled={buttonDisabled}
          />

          <VariantList
            selectedCategory={selectedCategory}
            selectedProduct={selectedProduct}
            items={items}
          />
        </Form>
      </Card.Body>
    </>
  );
};
